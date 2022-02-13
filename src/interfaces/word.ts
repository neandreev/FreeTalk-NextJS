export interface IWord {
  id: string,
  word: string,
  translation: string,
  category?: string,
  isLearned?: boolean,
  timeToTrain?: number,
  completedTrains?: number
}
