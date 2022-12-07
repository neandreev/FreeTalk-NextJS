import { FC, MouseEventHandler } from 'react';

import AnswerInform from '../AnswerInform';

import style from './QuizResponse.module.css';

interface IQuizResponse {
  handleNextQuestion: MouseEventHandler;
}

const QuizResponse: FC<IQuizResponse> = ({ handleNextQuestion }) => (
  <div className={style.quizFooter}>
    <AnswerInform />
    <span className={style.quizNextWord} onClick={handleNextQuestion}>
      Следующее слово
    </span>
  </div>
);

export default QuizResponse;
