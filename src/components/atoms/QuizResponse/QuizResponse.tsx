import { FC, MouseEventHandler } from 'react';

import AnswerInform from '../AnswerInform';

import style from './QuizResponse.module.css';

interface IQuizResponse {
  handleNextQuestion: MouseEventHandler;
}

const QuizResponse: FC<IQuizResponse> = ({ handleNextQuestion }) => (
  <div className={style['quiz-footer']}>
    <AnswerInform />
    <span className={style['quiz-next-word']} onClick={handleNextQuestion}>
      Следующее слово
    </span>
  </div>
);

export default QuizResponse;
