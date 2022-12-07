import { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';

import { Card, Button } from 'antd';
import Image from 'next/image';

import { CollectionWord } from '@prisma/client';

import trpc from '../../../utils/trpc';

import styles from './DetailCollectionWordCard.module.css';

const DetailCollectionWordCard: FC<{ word: CollectionWord }> = ({ word }) => {
  const utils = trpc.useContext();

  const { data: session } = useSession();
  const email = session?.user?.email || null;
  const query = trpc.useQuery(['words', email]);
  const words = useMemo(() => query.data || [], [query]);

  const addWordMutation = trpc.useMutation('add-word', {
    onSuccess() {
      utils.invalidateQueries('words');
    },
  });

  const [isAddedToDictionary, setIsAddedToDictionary] =
    useState<boolean>(false);

  const checkDuplicateWords = useCallback(
    (currentWord: string) =>
      words.find((item) => item.en.toLowerCase() === currentWord.toLowerCase()),
    [words]
  );

  const handleAddToDictionary = () => {
    const mutationData = {
      email: session?.user?.email as string,
      word: {
        en: word.en,
        ru: word.ru,
        image: word.image,
        timeToTrain: Math.round(Date.now() / 1000),
        category: word.category,
      },
    };

    addWordMutation.mutate(mutationData);
    setIsAddedToDictionary(true);
  };

  useEffect(() => {
    if (checkDuplicateWords(word.en)) {
      setIsAddedToDictionary(true);
    }
  }, [checkDuplicateWords, word]);

  return (
    <div>
      <Card
        style={{ width: '100%' }}
        cover={
          <div className={styles['card-cover']}>
            <Image
              alt={word.en}
              className={styles['card-image']}
              src={word.image}
              fill
            />
          </div>
        }
      >
        <div className={styles.content}>
          <div>
            <div>
              <span className={styles.title}>EN:</span>
              <span>{word.en}</span>
            </div>
            <div>
              <span className={styles.title}>RU:</span>
              <span>{word.ru}</span>
            </div>
          </div>
          <Button
            className="app-btn _green"
            disabled={isAddedToDictionary}
            onClick={handleAddToDictionary}
          >
            {isAddedToDictionary ? 'Добавлено' : 'Добавить'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DetailCollectionWordCard;
