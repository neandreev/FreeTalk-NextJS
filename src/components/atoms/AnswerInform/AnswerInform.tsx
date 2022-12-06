import { FC } from 'react';

import { selectCurrentQuestion, useStore } from '@/store/store';

const AnswerInform: FC = () => {
  const question = useStore(selectCurrentQuestion);
  const informText = question.wasAnsweredCorrectly ? 'Верно!' : 'Неверно!';

  return <span>{informText}</span>;
};

export default AnswerInform;
