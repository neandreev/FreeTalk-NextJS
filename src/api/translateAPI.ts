import _capitalize from 'lodash-es/capitalize';

import { IWord } from '../interfaces/word';

const TOKEN = process.env.YANDEX_IAM_TOKEN as string;
const CLOUD_FOLDER = process.env.YANDEX_CLOUD_FOLDER_ID as string;

type TWordWithoutID = Omit<IWord, 'id'>;

// class TranslateAPI {
// 	readonly API_KEY: string;

// 	constructor(API_KEY: string) {
// 		this.API_KEY = API_KEY;
// 	}

// 	getTranslate = async (from: string, to: string, word: string, abort: AbortSignal) : Promise<TWordWithoutID>  => {
// 		const response = await fetch(
// 			`https://reactmarathon-api.netlify.app/api/translate?text=${word}&lang=${from}-${to}`,
// 			{
// 				headers: {
// 					Authorization: this.API_KEY,
// 				},
// 				signal: abort
// 			}
// 		);
// 		const body = await response.json();
// 		const translate: TWordWithoutID = {
// 			en: from === 'en' ? _capitalize(word): _capitalize(body.translate),
// 			ru: from === 'en' ? _capitalize(body.translate): _capitalize(word),
// 			category:'Общее',
// 			learned: false,
// 			timeToTrain: Date.now(),
// 			completedTrains: 0,
// 			imageURL: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDIxNTN8MHwxfHNlYXJjaHwxfHxmaW5kfGVufDB8MHx8fDE2NDUyMDE1Nzg&ixlib=rb-1.2.1&q=80&w=1080',
// 		}
// 		return translate;
// 	}
// }\
const translate = async (
  word: string,
  signal: AbortSignal,
  translateTo: 'en' | 'ru'
) => {
  const translateData = {
    folderId: CLOUD_FOLDER,
    texts: [word],
    targetLanguageCode: translateTo,
  };

  // const translateResponse = await fetch(
  //   'https://translate.api.cloud.yandex.net/translate/v2/translate',
  //   {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${TOKEN}`,
  //     },
  //     mode: 'no-cors',
  //     body: JSON.stringify(translateData),
  //     signal,
  //   }
  // );

  // console.log(process.env);
  // console.log(CLOUD_FOLDER);
  
  // console.log(translateResponse);
};

export default translate;
