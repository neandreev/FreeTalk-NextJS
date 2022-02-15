export interface ITrainingWord {
	word: string;
	id: string;
	translation: string;
	category: string;
	isLearned: boolean;
	timeToTrain: number;
	completedTrains: number;
}
