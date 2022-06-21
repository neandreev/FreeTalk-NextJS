export interface IWord {
	en: string;
	id: string;
	ru: string;
	category: string;
	learned: boolean;
	timeToTrain: number;
	completedTrains: number;
	imageURL: string;
}
