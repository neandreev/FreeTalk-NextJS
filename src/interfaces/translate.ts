import { IWord } from './word';

export interface ITranslateFormValues {
  TranslateRequest: string;
}

export interface ICardTranslateRes {
  // word: Omit<IWord, 'id'>;
  word: string;
  toLang: string;
  signal: AbortSignal;
  onAddWordToDictionary: (word: Omit<IWord, 'id'>) => void;
}

export interface ITranslateResponse {
  text: string;
  translate: string;
}
