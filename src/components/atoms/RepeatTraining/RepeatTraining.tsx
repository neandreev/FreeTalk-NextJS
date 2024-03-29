import { FC } from 'react';

import { Button, Col, Row } from 'antd';

import style from './RepeatTraining.module.css';

interface IRepeatTraining {
  handleReset: () => void;
}

const RepeatTraining: FC<IRepeatTraining> = ({ handleReset }) => (
  <Row justify="space-around" className={style['repeat-training']}>
    <Col />

    <Col push={2}>
      <Button className="app-btn green" onClick={handleReset}>
        Вернуться к тренировке
      </Button>
    </Col>
  </Row>
);

export default RepeatTraining;
