import { NextApiRequest, NextApiResponse } from 'next';

const { UNSPLASH_ACCESS_KEY } = process.env;

const undefinedUrl =
  'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDIxNTN8MHwxfHNlYXJjaHwxfHxmaW5kfGVufDB8MHx8fDE2NDUyMDE1Nzg&ixlib=rb-1.2.1&q=80&w=1080';

const findWordImage = async (word: string) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=1&per_page=1&orientation=landscape&query=${word}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    const json = await response.json();

    const imageUrl = json.results[0]?.urls?.small || undefinedUrl;

    return { data: imageUrl, error: null };
  } catch (e) {
    return { data: undefinedUrl, error: e };
  }
};

const findImageAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  const queries = req.query as { word: string };
  const imageUrlData = await findWordImage(queries.word);

  res.status(200).json({ imageUrl: imageUrlData.data });
};

export default findImageAPI;
