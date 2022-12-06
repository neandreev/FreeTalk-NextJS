import { FC } from 'react';

import { useStore } from '@/store/store';
import { QuizStats } from '../../molecules/QuizStats';
import QuizQuestions from '../../molecules/QuizQuestions';

const Quiz: FC = () => {
  const isCompleted = useStore(({ isCompleted }) => isCompleted);

  return (
    <div className="quiz">
      {!isCompleted ? <QuizQuestions /> : <QuizStats />}
    </div>
  );
};

export default Quiz;
