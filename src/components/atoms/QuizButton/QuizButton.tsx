import _find from 'lodash-es/find';
import dayjs from 'dayjs';
import cn from 'classnames';
import { FC, useState } from 'react';

import { Card } from 'antd';
import Image from 'next/image';

import { LearningWord } from '@prisma/client';

import { selectCurrentQuestion, useStore } from '@/store';
import style from './QuizButton.module.css';

import trpc from '../../../utils/trpc';

interface IQuizButton {
  wordId: number;
  isCorrect: boolean;
}

const fibonacci: (n: number) => number = (n) => {
  if (n <= 2) {
    return 1;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const updateTimeToTrain = (completedTrains: number) => {
  const oneDayTimestamp = 24 * 60 * 60 * 1000;
  const daysToNextTraining = fibonacci(completedTrains);
  const roundedTimeToTrain = dayjs().endOf('day').valueOf();
  const newTimeToTrain =
    roundedTimeToTrain + oneDayTimestamp * daysToNextTraining;

  return newTimeToTrain;
};

const QuizButton: FC<IQuizButton> = ({ wordId, isCorrect }) => {
  const [isClicked, setIsClicked] = useState(false);

  const answerQuestion = useStore(({ answerQuestion }) => answerQuestion);

  const utils = trpc.useContext();
  const trainingWords = useStore(({ trainingWords }) => trainingWords);
  const { wasAnswered } = useStore(selectCurrentQuestion);

  const updateWordMutation = trpc.updateWordTrainingdata.useMutation({
    onSuccess() {
      utils.words.invalidate();
    },
  });

  const word = _find(trainingWords, { id: wordId }) as LearningWord;

  const handleButtonClick = () => {
    if (isClicked || wasAnswered) return;
    if (isCorrect) {
      const completedTrains = word.completedTrains + 1;
      const timeToTrain = updateTimeToTrain(completedTrains);
      const wordUpdate = {
        id: wordId,
        completedTrains,
        timeToTrain: Math.round(timeToTrain / 1000),
      };

      updateWordMutation.mutate(wordUpdate);
    }

    const answer = { answerId: wordId, isAnsweredCorrectly: isCorrect };

    answerQuestion(answer);
    setIsClicked(true);
  };

  const coverStyles = cn(style.img, { [style.blurred]: !wasAnswered });
  const cover = (
    <div className={cn(style.imgContainer, { [style.answered]: wasAnswered })}>
      <Image className={coverStyles} src={word.image} alt={word.ru} fill />
    </div>
  );

  const cardStyles = cn('quizButton', {
    quizButton_wrong: !isCorrect && isClicked,
    quizButton_correct: isCorrect && isClicked,
  });

  return (
    <Card
      hoverable
      className={cardStyles}
      cover={cover}
      onClick={handleButtonClick}
      data-quizbutton
    >
      <div>
        <div>
          <span className={style.blueTitle}>RU:</span>
          <span>{word.ru}</span>
        </div>
        <div>
          <span className={cn(style.blueTitle)}>EN:</span>
          <span
            className={cn(style.title, { [style.blurredTitle]: !wasAnswered })}
          >
            {word.en}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default QuizButton;
