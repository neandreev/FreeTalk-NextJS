import { FC, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import _capitalize from 'lodash-es/capitalize';

import { Row, Col, Card, Button, Spin, Empty } from 'antd';

import { IWord } from '@/interfaces/word';
import styles from './CardTranslateRes.module.css';

interface TranslateCardI {
  word: string;
  signal: AbortSignal;
  toLang: string;
  onAddWordToDictionary: (word: Omit<IWord, 'id'>) => void;
}

const CardTranslateRes: FC<TranslateCardI> = ({
  word,
  toLang,
  signal,
  onAddWordToDictionary,
}) => {
  const fetcher = (url: string) =>
    fetch(url, { signal }).then((res) => res.json());

  const { data, error } = useSWR(
    `/api/translate?words=${word}&tolang=${toLang}`,
    fetcher
  );

  const [englishWord, russianWord] =
    toLang === 'ru' ? [word, data?.translation] : [data?.translation, word];

  const imageURL = useSWR(`/api/findimage?word=${englishWord}`, fetcher).data
    ?.imageUrl;

  const learningWord: Omit<IWord, 'id'> = useMemo(
    () => ({
      en: _capitalize(englishWord),
      ru: _capitalize(russianWord),
      category: 'Общее',
      learned: false,
      timeToTrain: Date.now(),
      completedTrains: 0,
      imageURL,
    }),
    [englishWord, russianWord, imageURL]
  );

  // debugger;

  const handleAddWordToDictionary = useCallback(
    () => onAddWordToDictionary(learningWord),
    [onAddWordToDictionary, learningWord]
  );

  if (!data)
    return (
      <div className={styles.loading}>
        <h3 className={styles.title}>Ищем перевод ...</h3>
        <Spin className={styles.spin} size="large" />
      </div>
    );

  if (error)
    return (
      <div className={styles.translateError}>
        <h3 className={styles.title}>Сожалеем, перевод не найден</h3>
        <Empty description={false} />
      </div>
    );

  return (
    <Card
      className={styles['card-translate-res']}
      cover={
        <img
          className={styles['card-cover']}
          alt={russianWord}
          src={imageURL}
        />
      }
    >
      <Row justify="space-between" align="middle" wrap={false} gutter={[8, 8]}>
        <Col className={styles.cardText}>
          <p className={styles.translate}>
            <span className={styles.title}>EN:</span>
            {_capitalize(englishWord)}
          </p>
          <p className={styles.translate}>
            <span className={styles.title}>RU:</span>
            {_capitalize(russianWord)}
          </p>
        </Col>
        <Col>
          <Button
            className="app-btn _green"
            onClick={handleAddWordToDictionary}
          >
            Добавить
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default CardTranslateRes;
