export interface Question {
  wasAnswered: boolean;
  wasAnsweredCorrectly: null | boolean;
  correctAnswerId: string;
  wrongAnswersIds: string[];
};
