import { FC } from 'react';

import { Col, Row } from 'antd';

import QuizButton from '@/components/atoms/QuizButton';

import { useStore } from '@/store';

import { ITrainingAnswer } from '../../../interfaces/training';

interface IAnswerButtons {
  variants: ITrainingAnswer[];
}

const AnswerButtons: FC<IAnswerButtons> = ({ variants }) => {
  const currentQuestionId = useStore(
    ({ currentQuestionId }) => currentQuestionId
  );

  return (
    <Row gutter={[16, 16]}>
      {variants.map(({ wordId, isCorrect }) => {
        const key = `w${wordId}q${currentQuestionId}`;

        return (
          <Col span={12} key={key}>
            <QuizButton key={key} wordId={wordId} isCorrect={isCorrect} />
          </Col>
        );
      })}
    </Row>
  );
};

export default AnswerButtons;
