import { FC } from 'react';

import { IWord } from '@/interfaces/word';
import { Col, Empty, Row, Spin } from 'antd';
import useSWR from 'swr';
import CardTranslateRes from '../CardTranslateRes';

import styles from './AdditionalWords.module.css';

interface AdditionalWordsI {
  word: string;
  tolang: string;
  signal: AbortSignal;
  handleAddWordToDictionary: (word: Omit<IWord, 'id'>) => Promise<void>;
}

const AdditionalWords: FC<AdditionalWordsI> = ({
  word,
  tolang,
  signal,
  handleAddWordToDictionary,
}) => {
  const fetcher = (url: string) =>
    fetch(url, { signal }).then((res) => res.json());

  const { data: translateWord, error: wordError } = useSWR(
    `/api/translate?words=${word}&tolang=${tolang}`,
    fetcher
  );

  const wordForSearch = tolang === 'en' ? translateWord?.translation : word;

  const { data, error } = useSWR(
    `/api/findsynonims?word=${wordForSearch}`,
    fetcher
  );

  if (error || wordError)
    return (
      <div className={styles.test}>
        <h3 className={styles.title}>Сожалеем, похожие слова не найдены</h3>
        <Empty description={false} />
      </div>
    );

  if (!data || !translateWord)
    return (
      <div className={styles.loading}>
        <h3 className={styles.title}>Ищем дополнительные слова ...</h3>
        <Spin className={styles.spin} size="large" />
      </div>
    );

  const additionalWords = data.wordSynonims as string[];

  return (
    <>
      <h3 className={styles.title}>Посмотрите похожие слова:</h3>
      <Row gutter={[8, 8]} justify="center">
        {additionalWords.map((item) => (
          <Col key={item} xs={24} sm={24} md={11} lg={11} xl={10}>
            <CardTranslateRes
              toLang="ru"
              word={item}
              signal={signal}
              onAddWordToDictionary={handleAddWordToDictionary}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default AdditionalWords;
