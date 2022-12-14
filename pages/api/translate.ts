import { NextApiRequest, NextApiResponse } from 'next';

const SECRET = process.env.YANDEX_TRANSLATE_SECRET as string;
const CLOUD_FOLDER = process.env.YANDEX_CLOUD_FOLDER_ID as string;

const translateWords = async (word: string, translateTo: string) => {
  const translateData = {
    folderId: CLOUD_FOLDER,
    texts: [word],
    targetLanguageCode: translateTo,
  };

  try {
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

    return { data: json.translations[0].text, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
};

const translateAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  const queries = req.query as { words: string; tolang: string };
  const translateData = await translateWords(queries.words, queries.tolang);

  if (translateData.error !== null) {
    res.status(502).json({ error: translateData.error });
  } else {
    res.status(200).json({ translation: translateData.data });
  }
};

export default translateAPI;
