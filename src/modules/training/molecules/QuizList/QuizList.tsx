import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { selectCurrentQuestion } from '../../../../features/training/trainingSlice';
import { useAppSelector } from '../../../../hooks';
import { QuizButton } from '../../atoms/QuizButton';

interface Variant {
  wordId: string;
  type: 'wrong' | 'correct';
}

interface QuizListProps {
  variants: Variant[];
}

export const QuizList: React.FC<QuizListProps> = (props) => {
  const { variants } = props;
  const { wasAnswered } = useAppSelector(selectCurrentQuestion);

  useEffect(() => {
    const handleButtonEvents = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.dataset.quizbutton && wasAnswered) {
        e.stopPropagation();
      }
    };

    const quiz = document.getElementById('quiz')!;
    quiz.addEventListener('click', handleButtonEvents, true);

    return () => quiz.removeEventListener('click', handleButtonEvents, true);
  }, [wasAnswered]);

  const answerButtons = variants
    .map((variant) => (
      <Col span={12} key={variant.wordId}>
        <QuizButton {...variant} />
      </Col>
    ));

  return (
    <div id="quiz">
      <Row gutter={[16, 16]}>
        {answerButtons}
      </Row>
    </div>
  );
};
