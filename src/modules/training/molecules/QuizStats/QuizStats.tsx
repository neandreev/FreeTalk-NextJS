import _ from "lodash";
import { Card, Col, Row } from "antd";

import { Word } from "../../../../interfaces/word";
import { useAppSelector } from "../../../../hooks";
import { selectTraining } from "../../../../features/training/trainingSlice";

import classes from "./QuizStats.module.css";
import "./QuizStats.css";

interface WordStatProps {
  word: Word;
  correct: boolean;
};

const WordStat: React.FC<WordStatProps> = (props) => {
  const { correct } = props;
  const wordStyle = correct ? classes['correct'] : classes['wrong'];

  return (
    <Col className={wordStyle} span={12}>
      <span>{props.word.word}</span>
    </Col>
  );
};

export const QuizStats: React.FC = () => {
  const {
    trainingWords,
    questions,
    correctAnswers,
    completedQuestions,
  } = useAppSelector(selectTraining);
  const title = `Отлично! Ты правильно перевел ${correctAnswers} из ${completedQuestions} слов!`;

  const questionsWordsStats = questions
    .map((question) => ({
      word: _.find(trainingWords, { id: question.correctAnswerId }) as Word,
      correct: question.wasAnsweredCorrectly,
    }))
    .map((stat) => (
      <WordStat key={stat.word.id} word={stat.word} correct={stat.correct!} />
    ));

  return (
    <Card className="quiz-stats" title={title}>
      <Row>
        {questionsWordsStats}
      </Row>
    </Card>
  )
};
