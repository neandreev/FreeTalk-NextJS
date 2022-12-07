import { FC } from 'react';

import AnswerButtons from '@/components/atoms/AnswerButtons';
import { ITrainingAnswer } from '../../../interfaces/training';

interface IQuizList {
  variants: ITrainingAnswer[];
}

const QuizList: FC<IQuizList> = ({ variants }) => (
  <div id="quiz">
    <AnswerButtons variants={variants} />
  </div>
);

export default QuizList;
