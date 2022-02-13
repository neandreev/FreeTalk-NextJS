import _ from 'lodash';
import { Card } from 'antd';
import React, { useMemo } from 'react';

import { AnswerInform } from '../../atoms/AnswerInform';
import { QuizList } from '../../molecules/QuizList';

import {
  nextQuestion,
  selectCurrentQuestion,
  selectTraining,
} from '../../../../features/training/trainingSlice';
import { useAppDispatch, useAppSelector } from '../../../../hooks';

import { Word } from '../../../../interfaces/word';

import classes from "./QuizQuestions.module.css";
import "./QuizQuestions.css";

interface Variant {
  wordId: string;
  type: 'wrong' | 'correct';
}

export const QuizQuestions: React.FC = () => {
  const dispatch = useAppDispatch();

  const currentQuestion = useAppSelector(selectCurrentQuestion);
  const { currentQuestionId, trainingWords } = useAppSelector(selectTraining);

  const { wasAnswered } = currentQuestion;
  const answerId: string = currentQuestion.correctAnswerId;
  const correctWord = _.find(trainingWords, { id: answerId }) as Word;
  const [wrongAnswer1, wrongAnswer2, wrongAnswer3] =
    currentQuestion.wrongAnswersIds;

  const handleNextQuestionLink: React.MouseEventHandler = (e) => {
    e.preventDefault();

    dispatch(nextQuestion());
  };

  const variants: Variant[] = [
    { wordId: answerId, type: 'correct' },
    { wordId: wrongAnswer1, type: 'wrong' },
    { wordId: wrongAnswer2, type: 'wrong' },
    { wordId: wrongAnswer3, type: 'wrong' },
  ];

  const shuffledVariants = useMemo(
    () => _.shuffle(variants),
    [currentQuestionId]
  );

  const QuestionTitle = (
    <span>
      Выберите перевод слова: <span style={{ fontWeight: 'bold' }}>{correctWord.word}</span>
    </span>
  );

  return (
    <Card className="quiz" title={QuestionTitle} style={{ width: 500 }}>
      <QuizList variants={shuffledVariants} />
      {wasAnswered ? (
        <div className={classes.quizFooter}>
          <AnswerInform />
          <span className={classes.quizNextWord} onClick={handleNextQuestionLink}>Next word</span>
        </div>
      ) : null}
    </Card>
  );
};
