export interface IQuestion {
  wasAnswered: boolean;
  wasAnsweredCorrectly: null | boolean;
  answerId: number;
  correctAnswerId: number;
  wrongAnswersIds: number[];
}
