import _find from 'lodash-es/find';
import _shuffle from 'lodash-es/shuffle';
import { FC, useMemo } from 'react';

import { Card, Space } from 'antd';

import { selectCurrentQuestion, useStore } from '@/store/store';
import { LearningWord } from '@prisma/client';

import QuizResponse from '@/components/atoms/QuizResponse';
import QuizList from '../QuizList';

import { ITrainingAnswer } from '../../../interfaces/training';

const QuizQuestions: FC = () => {
  const { wasAnswered, correctAnswerId, wrongAnswersIds } = useStore(
    selectCurrentQuestion
  );
  const trainingWords = useStore((store) => store.trainingWords);
  const nextQuestion = useStore(({ nextQuestion }) => nextQuestion);

  const correctWord = _find(trainingWords, {
    id: correctAnswerId,
  }) as LearningWord;
  const [wrongAnswer1, wrongAnswer2, wrongAnswer3] = wrongAnswersIds;

  const handleNextQuestionLink: React.MouseEventHandler = (e) => {
    e.preventDefault();
    nextQuestion();
  };

  const shuffledVariants = useMemo(() => {
    const variants: ITrainingAnswer[] = [
      { wordId: correctAnswerId, isCorrect: true },
      { wordId: wrongAnswer1, isCorrect: false },
      { wordId: wrongAnswer2, isCorrect: false },
      { wordId: wrongAnswer3, isCorrect: false },
    ];

    return _shuffle(variants);
  }, [correctAnswerId, wrongAnswer1, wrongAnswer2, wrongAnswer3]);

  const QuestionTitle = (
    <Space wrap>
      <span>Выберите перевод слова:</span>
      <span style={{ fontWeight: 'bold' }}>{correctWord.en}</span>
    </Space>
  );

  return (
    <Card title={QuestionTitle}>
      <QuizList variants={shuffledVariants} />
      {wasAnswered && (
        <QuizResponse handleNextQuestion={handleNextQuestionLink} />
      )}
    </Card>
  );
};

export default QuizQuestions;
