import { NextApiRequest, NextApiResponse } from 'next';

const { UNSPLASH_ACCESS_KEY } = process.env;

const undefinedUrl =
  'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDIxNTN8MHwxfHNlYXJjaHwxfHxmaW5kfGVufDB8MHx8fDE2NDUyMDE1Nzg&ixlib=rb-1.2.1&q=80&w=1080';

const findWordImage = async (word: string) => {
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

  return imageUrl;
};

const findImageAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  const queries = req.query as { word: string };
  const imageUrl = await findWordImage(queries.word);

  console.log('findImageWord', queries.word);
  console.log('findImageResult', imageUrl);

  res.status(200).json({ imageUrl });
};

export default findImageAPI;
