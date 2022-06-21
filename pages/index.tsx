import { FC, useCallback, useEffect, useState } from 'react';

import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { createSSGHelpers } from '@trpc/react/ssg';

import superjson from 'superjson';
import firebase from 'firebase';

import { Translate } from '../src/components/organism/Translate';
import { Description } from '../src/components/organism/Description';
import { trpc } from '../src/utils/trpc';

import { getSession, useSession } from 'next-auth/react';
import { appRouter } from './api/trpc/[trpc]';
import { LearningWord } from '@prisma/client';
import { CompassOutlined } from '@ant-design/icons';
import { TranslateReqForm } from '../src/components/molecules/TranslateReqForm';
import { Col, Empty, Row, Spin, message } from 'antd';
import { CardTranslateRes } from '../src/components/molecules/CardTranslateRes';
import { IWord } from '../src/interfaces/word';
import { useAuth } from '../src/hooks';
import { translateAPI } from '../src/api/translateAPI';
import { findImageAPI } from '../src/api/findImageAPI';
import { findHyponemesAPI } from '../src/api/findHyponemesAPI';

// import styles from './MainPage.module.css'; //TODO: add Mainpage style
import styles from '../src/components/organism/Training/Training.module.css';
import { Updater } from 'react-query/types/core/utils';
import _now from 'lodash/now';

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const ssg = await createSSGHelpers({
		router: appRouter,
		ctx: {},
		transformer: superjson,
	});

	const session = await getSession(context);
	const email = session?.user?.email || null;

	await ssg.fetchQuery('words', email);

	return {
		props: {
			trpcState: ssg.dehydrate(),
			session,
		},
	};
}

export const MainPage = () => {
	const [startTranslate, setStartTranslate] = useState(false);

	const { data: session } = useSession();
	const email = session?.user?.email || null;

	const handleStartTranslate = useCallback((status: boolean) => {
		setStartTranslate(status);
	}, []);

	const query = trpc.useQuery(['words', email]);
	const words = query.data || [];

	const utils = trpc.useContext();

	const controller = new AbortController();
	const signal = controller.signal;

	const auth = useAuth();
	const user = auth?.user as firebase.User;

	const addWordMutation = trpc.useMutation('add-word', {
		onSuccess() {
			utils.invalidateQueries('words');
		}
	});

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

		await addWordMutation.mutate(mutationData);
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

				handleStartTranslate && handleStartTranslate(true);

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
			handleStartTranslate && handleStartTranslate(false);
		}
	}, [user]);

	return (
		<div>
			{/* <h2 className={`page__title ${styles.title}`}>Время учить слова онлайн</h2> */}
			<h2 className={`page__title`}>Время учить слова онлайн</h2>
			{/* <Translate
				onStartTranslate={handleStartTranslate}
				words={query.data?.words as LearningWord[]}
				// words={[]}
			/> */}
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
			{!startTranslate && <Description />}
			{/* hello world! */}
		</div>
	);
};

export default MainPage;
