import _shuffle from 'lodash-es/shuffle';
import {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Col, Row } from 'antd';

import { useSession } from 'next-auth/react';
import { LearningWord } from '@prisma/client';
import { useStore } from '@/store';
import shallow from 'zustand/shallow';

import TrainingIntro from '@/components/atoms/TrainingIntro';
import RepeatTraining from '@/components/atoms/RepeatTraining';
import Quiz from '../Quiz';
import { IQuestion } from '../../../interfaces/question';

import style from './Training.module.css';
import trpc from '../../../utils/trpc';

const generateQuestions = (words: LearningWord[]) => {
  const questions = words.map((word) => {
    const correctAnswerId = word.id;
    const wrongAnswersIds = _shuffle(words)
      .map((word) => word.id)
      .filter((wordId) => wordId !== correctAnswerId)
      .slice(0, 3);

    const question: IQuestion = {
      wasAnswered: false,
      wasAnsweredCorrectly: null,
      answerId: 0,
      correctAnswerId,
      wrongAnswersIds,
    };

    return question;
  });

  return questions;
};

const selectWordsForTraining = (words: LearningWord[]) => {
  const availableWordsForTraining = words.filter((word) => {
    const timestamp = Date.now();
    return word.timeToTrain * 1000 <= timestamp && !word.learned;
  });
  const shuffledWords = _shuffle(availableWordsForTraining);
  const wordsForTraining = shuffledWords.slice(0, 10);

  return wordsForTraining;
};

const Training: FC = () => {
  const { data: session } = useSession();
  const email = session?.user?.email || null;

  const [isCompleted, resetTraining, setTrainingWords, setQuestions] = useStore(
    (state) => [
      state.isCompleted,
      state.resetTraining,
      state.setTrainingWords,
      state.setQuestions,
    ],
    shallow
  );

  const wordsQuery = trpc.useQuery(['words', email]);
  const { isLoading } = wordsQuery;
  const words = useMemo(() => wordsQuery.data || [], [wordsQuery.data]);
  const wordsForTraining = useMemo(
    () => selectWordsForTraining(words),
    [words]
  );
  const questions = useMemo(
    () => generateQuestions(wordsForTraining),
    [wordsForTraining]
  );

  const [startTraining, setStartTraining] = useState(false);
  const [isDataPrepared, setIsDataPrepared] = useState(false);
  const [isTrainingAvailable, setIsTrainingAvailable] = useState(false);
  const [isTrainingRepeated, setIsTrainingRepeated] = useState(false);

  const handleResetTraining = useCallback(() => {
    resetTraining();
    setStartTraining(false);
    setIsDataPrepared(false);
    setIsTrainingAvailable(false);
    setIsTrainingRepeated(true);
  }, [resetTraining]);

  const handleStartTraining: MouseEventHandler = () => {
    setStartTraining(true);
  };

  useEffect(() => {
    if ((!isLoading || isTrainingRepeated) && !startTraining) {
      setTrainingWords(wordsForTraining);
      setQuestions(questions);

      if (wordsForTraining.length >= 10) {
        setIsTrainingAvailable(true);
      }

      setIsDataPrepared(true);
      setIsTrainingRepeated(false);
    }
  }, [
    isLoading,
    isTrainingRepeated,
    setQuestions,
    setTrainingWords,
    handleResetTraining,
    wordsForTraining,
    questions,
    startTraining,
  ]);

  useEffect(() => handleResetTraining, [handleResetTraining]);

  return (
    <Row justify="center" align="middle">
      <Col className="training">
        <h1 className={`page__title ${style.title}`}>Тренировка</h1>
        <hr />
        {!isLoading && isDataPrepared && startTraining ? (
          <Quiz />
        ) : (
          <TrainingIntro
            isDataPrepared={isDataPrepared}
            isTrainingAvailable={isTrainingAvailable}
            handleStart={handleStartTraining}
          />
        )}
        {isCompleted && <RepeatTraining handleReset={handleResetTraining} />}
      </Col>
    </Row>
  );
};

export default Training;
