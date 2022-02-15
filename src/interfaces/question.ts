export interface IQuestion {
	wasAnswered: boolean;
	wasAnsweredCorrectly: null | boolean;
	correctAnswerId: string;
	wrongAnswersIds: string[];
}
