export interface ICardTranslateReq {
	title: string;
	isFetching: boolean;
	onTranslateRequest: (word: string) => void;
}

export interface ITranslateFormValues {
	TranslateRequest: string;
}

export interface ICardTranslateRes {
	title: string;
	translateResponse: string;
	onAddWordToDictionary: () => void;
}

export interface ITranslateResponse {
	text: string;
	translate: string;
}
