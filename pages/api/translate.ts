import { NextApiRequest, NextApiResponse } from 'next';

const SECRET = process.env.YANDEX_TRANSLATE_SECRET as string;
const CLOUD_FOLDER = process.env.YANDEX_CLOUD_FOLDER_ID as string;

const translateWords = async (word: string, translateTo: string) => {
  const translateData = {
    folderId: CLOUD_FOLDER,
    texts: [word],
    targetLanguageCode: translateTo,
  };

  const translateResponse = await fetch(
    'https://translate.api.cloud.yandex.net/translate/v2/translate',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Api-Key ${SECRET}`,
      },
      mode: 'no-cors',
      body: JSON.stringify(translateData),
      // signal,
    }
  );

  const json = await translateResponse.json();
  console.log('json translate', json);

  return json.translations[0].text;
};

const translateAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  const queries = req.query as { words: string; tolang: string };
  const translation = await translateWords(queries.words, queries.tolang);

  console.log('translationWord', queries.words);
  console.log('translationResult', translation);

  res.status(200).json({ translation });
};

export default translateAPI;
