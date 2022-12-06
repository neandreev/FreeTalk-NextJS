import { FC } from 'react';
import cn from 'classnames';

import { Col } from 'antd';

import { LearningWord } from '@prisma/client';

import style from './WordStat.module.css';

interface IWordStat {
  word: LearningWord;
  correct: boolean;
}

const WordStat: FC<IWordStat> = ({ correct, word }) => {
  const wordStyle = cn([style.wordStat], {
    [style.wordStat_correct]: correct,
    [style.wordStat_wrong]: !correct,
  });

  return (
    <Col className={wordStyle} span={12}>
      <span>{word.en}</span>
    </Col>
  );
};

export default WordStat;
