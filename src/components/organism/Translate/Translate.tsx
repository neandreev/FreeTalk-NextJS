import { useEffect, useState } from 'react';

import { Description } from '@/components/organism/Description';
import { trpc } from '@/utils/trpc';

import { useSession } from 'next-auth/react';
import { LearningWord } from '@prisma/client';
import { TranslateReqForm } from '@/components/molecules/TranslateReqForm';
import { Col, Empty, Row, Spin, message } from 'antd';
import { CardTranslateRes } from '@/components/molecules/CardTranslateRes';
import { IWord } from '@/interfaces/word';

import { translateAPI } from '@/api/translateAPI';
import { findImageAPI } from '@/api/findImageAPI';
import { findHyponemesAPI } from '@/api/findHyponemesAPI';

import styles from '@/components/organism/Training/Training.module.css';

interface ITranslateData {
	fromLang: string;
	toLang: string;
	word: string;
}

type TWordWithoutID = Omit<IWord, 'id'>;
type translateStatus = 'idle' | 'translating' | 'error' | 'success';

const wordIsDublicated = (en: string, data: LearningWord[]) => {
	if (!data || data?.length === 0) {
		return false;
	} else {
		return !!data.find((element) => element.en === en);
	}
};

const Translate = () => {
	const utils = trpc.useContext();
	const { data: session } = useSession();
	const email = session?.user?.email || null;

	const query = trpc.useQuery(['words', email]);
	const words = query.data || [];

	const addWord = trpc.useMutation('add-word', {
		onError(e) {
			message.error({
				content: 'Не удалось добавить новое слово: проблемы с сетью',
				duration: 2,
			});
			console.error(e);
		},
		onSuccess(data) {
			utils.invalidateQueries('words');
			message.success({
				content: `Добавлено новое слово: ${data.word.en}`,
				duration: 2,
			});
		},
	});

	const controller = new AbortController();
	const signal = controller.signal;

	const [translateStatus, setTranslateStatus] = useState('idle');
	const [startTranslate, setStartTranslate] = useState(false);
	const [translateResponse, setTranslateResponse] =
		useState<TWordWithoutID | null>(null);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [additionalWords, setAdditionalWords] = useState<
		(TWordWithoutID | null)[] | []
	>([]);
	const [isAdditionalWordsError, setIsAdditionalWordsError] = useState(false);
	const [isAdditionalWordsLoading, setIsAdditionalWordsLoading] =
		useState(false);
	const [isFormDisabled, setIsFormDisabled] = useState(false);

	const handleAddWordToDictionary = async (word: TWordWithoutID) => {
		if (!session) {
			message.warning({
				content: 'Авторизуйтесь для добавления слова в словарь',
				duration: 2,
			});
			return;
		}

		if (wordIsDublicated(word.en, words)) {
			message.warning({
				content: 'Такое слово уже есть в словаре',
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

		addWord.mutate(mutationData);
	};

	const getMainTranslate = async ({
		fromLang,
		toLang,
		word,
	}: ITranslateData) => {
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
			setIsError(true);
			message.warning({
				content: 'Перевод не найден. Попробуйте другое слово',
				duration: 2,
			});
		}

		setIsLoading(false);
		return response;
	};

	const getTranslateAddWords = async (word: TWordWithoutID) => {
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

			setIsAdditionalWordsLoading(false);

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
		setIsFormDisabled(true);

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
				setIsAdditionalWordsError(true);
			}

			setAdditionalWords(addTranslate);
		} catch (e) {}

		setIsAdditionalWordsLoading(false);
		setIsFormDisabled(false);
	};

	const handleSubmitTranslateReqForm = (props: {
		TranslateDirection: string;
		TranslateRequest: string;
	}) => {
		const [fromLang, toLang] = props.TranslateDirection.toLowerCase().split('-');

		setStartTranslate(true);
		setIsError(false);
		setIsLoading(true);
		setTranslateResponse(null);
		setAdditionalWords([]);
		setIsAdditionalWordsError(false);
		setIsAdditionalWordsLoading(true);

		getTranslate(fromLang, toLang, props.TranslateRequest);
	};

	useEffect(() => {
		return () => controller.abort();
	}, []);

	useEffect(() => {
		if (!session?.user) {
			setTranslateResponse(null);
			setAdditionalWords([]);
			setStartTranslate(false);
		}
	}, [session]);

	return (
		<div>
			<h2 className={`page__title ${styles.title}`}>Время учить слова онлайн</h2>
			<div className={styles.wrapper}>
				<TranslateReqForm
					onSubmitForm={handleSubmitTranslateReqForm}
					disabled={isFormDisabled}
				/>
				<div className={styles.mainTranslate}>
					{isLoading && (
						<div className={styles.loading}>
							<h3 className={styles.title}>Ищем перевод ...</h3>
							<Spin className={styles.spin} size='large' />
						</div>
					)}
					{isError && (
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
					{isAdditionalWordsLoading && (
						<div className={styles.loading}>
							<h3 className={styles.title}>Ищем дополнительные слова ...</h3>
							<Spin className={styles.spin} size='large' />
						</div>
					)}
					{isAdditionalWordsError && (
						<div className={styles.translateError}>
							<h3 className={styles.title}>Сожалеем, похожие слова не найдены</h3>
							<Empty description={false} />
						</div>
					)}
					{!isFormDisabled &&
						!isAdditionalWordsError &&
						!!additionalWords.length && (
							<h3 className={styles.title}>Посмотрите похожие слова:</h3>
						)}
					<Row gutter={[8, 8]} justify='center'>
						{additionalWords.map((item, index) => {
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
		</div>
	);
};

export { Translate };
