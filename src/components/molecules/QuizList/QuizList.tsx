import { FC } from 'react';

import { ITrainingAnswer } from '../../../interfaces/training';
import { AnswerButtons } from '../../atoms/AnswerButtons';

interface IQuizList {
  variants: ITrainingAnswer[];
}

const QuizList: FC<IQuizList> = ({ variants }) => (
  <div id="quiz">
    <AnswerButtons variants={variants} />
  </div>
);

export default QuizList;
