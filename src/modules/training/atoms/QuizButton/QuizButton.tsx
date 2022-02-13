import _ from "lodash";
import { useEffect, useState } from "react";
import { answerQuestion, selectTraining } from "../../../../features/training/trainingSlice";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { IWord } from "../../../../interfaces/word";
import classes from "./QuizButton.module.css";

interface QuizButtonProps {
  wordId: string;
  type: "correct" | "wrong";
};

export const QuizButton: React.FC<QuizButtonProps> = (props) => {
  const [isClicked, setIsClicked] = useState(false)

  const dispatch = useAppDispatch();
  const { trainingWords, currentQuestionId } = useAppSelector(selectTraining);

  const word = _.find(trainingWords, { id: props.wordId }) as IWord;
  const isAnsweredCorrectly = props.type !== "wrong";
  const clickedButtonClasses = isAnsweredCorrectly
    ? classes.quizButton_correct : classes.quizButton_wrong;

  const handleButtonClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    const answer = { wordId: props.wordId, isAnsweredCorrectly };
    dispatch(answerQuestion(answer));
    setIsClicked(true);
  };

  useEffect(() => {
    return () => {
      setIsClicked(false);
    }
  }, [currentQuestionId]);

  return <>
    {
      !isClicked
      ? <div data-quizbutton className={classes.quizButton} onClick={handleButtonClick}>{word.translation}</div>
      : <div data-quizbutton className={`${classes.quizButton} ${clickedButtonClasses}`}>{word.translation}</div>
    }
  </>
};
