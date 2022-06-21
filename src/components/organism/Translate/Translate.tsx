import { FC, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks';

import { CardTranslateRes } from '../../molecules/CardTranslateRes';
import { Spin } from 'antd';

import { useSession } from 'next-auth/react';
import { client } from '../../../utils/client';
import { translateAPI } from '../../../api/translateAPI';
import { findImageAPI } from '../../../api/findImageAPI';
import { findHyponemesAPI } from '../../../api/findHyponemesAPI';
import firebase from 'firebase';

import { IWord } from '../../../interfaces/word';
import { TranslateReqForm } from '../../molecules/TranslateReqForm';

import { Row, Col, Empty, message } from 'antd';

import styles from './Translate.module.css';
import { trpc } from '../../../utils/trpc';
import { LearningWord } from '@prisma/client';

interface ITranslateFormData {
	TranslateDirection: string;
	TranslateRequest: string;
}

interface ITranslateData {
	fromLang: string;
	toLang: string;
	word: string;
}

interface ITranslate {
	onStartTranslate: (status: boolean) => void;
	words: LearningWord[];
}

type TWordWithoutID = Omit<IWord, 'id'>;

type TCheckDuplicateWords = (
	ru: string,
	en: string,
	data: LearningWord[]
) => boolean;

type TGetMainTranslate = ({
	fromLang,
	toLang,
	word,
}: ITranslateData) => Promise<TWordWithoutID>;

type TGetTranslateAddWords = (
	word: TWordWithoutID
) => Promise<(TWordWithoutID | null)[]>;

type THandleSubmitTranslateReqForm = ({
	TranslateDirection,
	TranslateRequest,
}: ITranslateFormData) => void;

const checkDuplicateWords: TCheckDuplicateWords = (ru, en, data) => {
	if (!data || data?.length === 0) {
		return false;
	} else {
		return !!data.find((element) => element.ru === ru);
	}
};

export const Translate: FC<ITranslate> = ({ onStartTranslate, words }) => {
	const controller = new AbortController();
	const signal = controller.signal;

	const auth = useAuth();
	const user = auth?.user as firebase.User;

	const { data: session } = useSession();
	const addWordMutation = trpc.useMutation(['add-word']);

	const [translateResponse, setTranslateResponse] =
		useState<TWordWithoutID | null>(null);
	const [translateError, setTranslateError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [addWords, setAddWords] = useState<(TWordWithoutID | null)[] | []>([]);
	const [addWordsError, setAddWordsError] = useState(false);
	const [isLoadingAdd, setIsLoadingAdd] = useState(false);
	const [disabledForm, setDisabledForm] = useState(false);

	const handleAddWordToDictionary = async (word: TWordWithoutID) => {
		if (!session) {
			message.warning({
				content: 'Авторизуйтесь для добавления слова в словарь',
				duration: 2,
			});
			return;
		}

		const mutationData = {
			email: session.user?.email as string,
			word: {
				en: word.en,
				ru: word.ru,
				image: word.imageURL,
				timeToTrain: Math.round(Date.now() / 1000),
			},
		};

		if (checkDuplicateWords(word.ru, word.en, words)) {
			message.warning({
				content: 'Такое слово уже есть в словаре',
				duration: 2,
			});
			return;
		}

		const newWordMutation = addWordMutation.mutate(mutationData);

		message.success({
			content: 'Добавлено новое слово',
			duration: 2,
		});
	};

	const getMainTranslate: TGetMainTranslate = async ({
		fromLang,
		toLang,
		word,
	}) => {
		const response = await translateAPI.getTranslate(
			fromLang,
			toLang,
			word,
			signal
		);

		if (!!response.en && !!response.ru) {
			try {
				const imageURL = await findImageAPI.getImage(response.en, signal);
				!!imageURL && (response.imageURL = imageURL);
			} catch (e) {}
			setTranslateResponse(response);
		} else {
			setTranslateError(true);
			message.warning({
				content: 'Перевод не найден. Попробуйте другое слово',
				duration: 2,
			});
		}

		setIsLoading(false);
		return response;
	};

	const getTranslateAddWords: TGetTranslateAddWords = async (word) => {
		const getTranslatePromise = async (
			word: string
		): Promise<TWordWithoutID | null> => {
			let translate;
			let imageURL;

			try {
				translate = await translateAPI.getTranslate('en', 'ru', word, signal);
				if (!!translate.ru && !!translate.en) {
					imageURL = await findImageAPI.getImage(translate.en, signal);
					!!imageURL && (translate.imageURL = imageURL);
					return translate;
				}
			} catch (e) {
				if (!!translate?.ru && !!translate?.en) {
					return translate;
				}
				return null;
			}

			setIsLoadingAdd(false);

			return null;
		};

		const addWords: string[] = await findHyponemesAPI.getHyponemes(
			word.en,
			signal
		);

		return Promise.all<TWordWithoutID | null>(addWords.map(getTranslatePromise));
	};

	const getTranslate = async (
		fromLang: string,
		toLang: string,
		word: string
	) => {
		setDisabledForm(true);

		try {
			const mainTranslate = await getMainTranslate({
				fromLang: fromLang,
				toLang: toLang,
				word: word,
			});
			const addTranslate = await getTranslateAddWords(mainTranslate);

			const addTranslateLength = addTranslate.length;
			const counterNull = addTranslate.filter((item) => item === null).length;

			if (addTranslateLength === counterNull) {
				setAddWordsError(true);
			}

			setAddWords(addTranslate);
		} catch (e) {}

		setIsLoadingAdd(false);
		setDisabledForm(false);
	};

	const handleSubmitTranslateReqForm =
		useCallback<THandleSubmitTranslateReqForm>(
			({ TranslateDirection, TranslateRequest }) => {
				const [fromLang, toLang] = TranslateDirection.toLowerCase().split('-');

				onStartTranslate && onStartTranslate(true);

				setTranslateError(false);
				setIsLoading(true);
				setTranslateResponse(null);
				setAddWordsError(false);
				setAddWords([]);
				setAddWordsError(false);
				setIsLoadingAdd(true);

				getTranslate(fromLang, toLang, TranslateRequest);
			},
			[isLoading, isLoadingAdd]
		);

	useEffect(() => {
		return () => {
			controller.abort();
		};
	}, []);

	useEffect(() => {
		if (!user) {
			setTranslateResponse(null);
			setAddWords([]);
			onStartTranslate && onStartTranslate(false);
		}
	}, [user]);

	return (
		<div className={styles.wrapper}>
			<TranslateReqForm
				onSubmitForm={handleSubmitTranslateReqForm}
				disabled={disabledForm}
			/>
			<div className={styles.mainTranslate}>
				{isLoading && (
					<div className={styles.loading}>
						<h3 className={styles.title}>Ищем перевод ...</h3>
						<Spin className={styles.spin} size='large' />
					</div>
				)}
				{translateError && (
					<div className={styles.translateError}>
						<h3 className={styles.title}>Сожалеем, перевод не найден</h3>
						<Empty description={false} />
					</div>
				)}
				{translateResponse && (
					<Row gutter={[8, 8]} justify='center'>
						<Col span={24}>
							<h3 className={styles.title}>Ваше слово:</h3>
						</Col>
						<Col xs={24} sm={24} md={11} lg={11} xl={10}>
							<CardTranslateRes
								word={translateResponse}
								onAddWordToDictionary={handleAddWordToDictionary}
							/>
						</Col>
					</Row>
				)}
			</div>

			<div className={styles.addTranslate}>
				{isLoadingAdd && (
					<div className={styles.loading}>
						<h3 className={styles.title}>Ищем дополнительные слова ...</h3>
						<Spin className={styles.spin} size='large' />
					</div>
				)}
				{addWordsError && (
					<div className={styles.translateError}>
						<h3 className={styles.title}>Сожалеем, похожие слова не найдены</h3>
						<Empty description={false} />
					</div>
				)}
				{!disabledForm && !addWordsError && !!addWords.length && (
					<h3 className={styles.title}>Посмотрите похожие слова:</h3>
				)}
				<Row gutter={[8, 8]} justify='center'>
					{addWords.map((item, index) => {
						if (!!item) {
							return (
								<Col key={index} xs={24} sm={24} md={11} lg={11} xl={10}>
									<CardTranslateRes
										key={index}
										word={item}
										onAddWordToDictionary={handleAddWordToDictionary}
									/>
								</Col>
							);
						}
					})}
				</Row>
			</div>
		</div>
	);
};
