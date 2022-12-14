import { FC, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import _capitalize from 'lodash-es/capitalize';

import { Row, Col, Card, Button, Spin, Empty } from 'antd';
import Image from 'next/image';

import { IWord } from '@/interfaces/word';
import styles from './CardTranslateRes.module.css';

interface TranslateCardI {
  word: string;
  signal: AbortSignal;
  toLang: string;
  onAddWordToDictionary: (word: IWord) => void;
}

const CardTranslateRes: FC<TranslateCardI> = ({
  word,
  toLang,
  signal,
  onAddWordToDictionary,
}) => {
  const fetcher = async (url: string) => {
    const res = await fetch(url, { signal });

    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      throw error;
    }

    return res.json();
  };

  const { data, error, isLoading } = useSWR(
    `/api/translate?words=${word}&tolang=${toLang}`,
    fetcher
  );

  const [englishWord, russianWord] =
    toLang === 'ru' ? [word, data?.translation] : [data?.translation, word];

  const {
    data: imageData,
    error: imageError,
    isLoading: isImageLoading,
  } = useSWR(`/api/findimage?word=${englishWord}`, fetcher);

  const learningWord: IWord = useMemo(
    () => ({
      en: _capitalize(englishWord),
      ru: _capitalize(russianWord),
      category: 'Общее',
      learned: false,
      timeToTrain: Date.now(),
      completedTrains: 0,
      imageURL: imageData?.imageUrl,
    }),
    [englishWord, russianWord, imageData]
  );

  const handleAddWordToDictionary = useCallback(
    () => onAddWordToDictionary(learningWord),
    [onAddWordToDictionary, learningWord]
  );

  if (error || imageError)
    return (
      <div className={styles['translate-error']}>
        <h3 className={styles.title}>Сожалеем, перевод не найден</h3>
        <Empty description={false} />
      </div>
    );

  if (isLoading || isImageLoading)
    return (
      <div className={styles.loading}>
        <h3 className={styles.title}>Ищем перевод ...</h3>
        <Spin className={styles.spin} size="large" />
      </div>
    );

  return (
    <Card
      className={styles['card-translate-res']}
      cover={
        <div className={styles['card-cover']}>
          <Image
            className={styles['card-image']}
            alt={russianWord}
            src={imageData.imageUrl}
            fill
            sizes="25vw"
          />
        </div>
      }
    >
      <Row justify="space-between" align="middle" wrap={false} gutter={[8, 8]}>
        <Col className={styles['card-text']}>
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
          <Button className="app-btn green" onClick={handleAddWordToDictionary}>
            Добавить
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default CardTranslateRes;
