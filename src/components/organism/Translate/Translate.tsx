import { useEffect, useMemo, useState } from 'react';

import { Col, Row, message } from 'antd';

import trpc from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import { LearningWord } from '@prisma/client';

import TranslateReqForm from '@/components/molecules/TranslateReqForm';
import CardTranslateRes from '@/components/molecules/CardTranslateRes';
import AdditionalWords from '@/components/molecules/AdditionalWords';
import Description from '@/components/organism/Description';

import { IWord } from '@/interfaces/word';

import styles from './Translate.module.css';

const wordIsDublicated = (en: string, data: LearningWord[]) => {
  if (!data || data?.length === 0) {
    return false;
  }
  return !!data.find((element) => element.en === en);
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

  const controller = useMemo(() => new AbortController(), []);
  const { signal } = controller;

  const [startTranslate, setStartTranslate] = useState(false);
  // const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [word, setWord] = useState('');
  const [toLang, setToLang] = useState('ru');

  const handleAddWordToDictionary = async (word: IWord) => {
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

  const handleSubmitTranslation = (
    translateDirection: string,
    translateRequest: string
  ) => {
    const [, toLang] = translateDirection.toLowerCase().split('-');

    setStartTranslate(true);
    setWord(translateRequest);
    setToLang(toLang);
  };

  useEffect(() => () => controller.abort(), [controller]);

  useEffect(() => {
    if (!session?.user) {
      setStartTranslate(false);
    }
  }, [session]);

  return (
    <div>
      <h2 className={`page__title ${styles.title}`}>
        Время учить слова онлайн
      </h2>
      <div className={styles.wrapper}>
        <TranslateReqForm
          onSubmitForm={handleSubmitTranslation}
          // disabled={isFormDisabled}
        />
        <div className={styles.mainTranslate}>
          {startTranslate && (
            <Row gutter={[8, 8]} justify="center">
              <Col span={24}>
                <h3 className={styles.title}>Ваше слово:</h3>
              </Col>
              <Col xs={24} sm={24} md={11} lg={11} xl={10}>
                <CardTranslateRes
                  word={word}
                  toLang={toLang}
                  signal={signal}
                  onAddWordToDictionary={handleAddWordToDictionary}
                />
              </Col>
            </Row>
          )}
        </div>

        <div className={styles.addTranslate}>
          {startTranslate && (
            <AdditionalWords
              tolang={toLang}
              signal={signal}
              word={word}
              handleAddWordToDictionary={handleAddWordToDictionary}
            />
          )}
        </div>
      </div>
      {!startTranslate && <Description />}
    </div>
  );
};

export default Translate;
