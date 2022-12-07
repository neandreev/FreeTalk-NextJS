import { NextApiRequest, NextApiResponse } from 'next';

interface DatamuseMLI {
  word: string;
  score: number;
  tags: string[];
}

const findSynonims = async (word: string) => {
  const result = await fetch(`https://api.datamuse.com/words?max=4&ml=${word}`);

  const closeWordsData = (await result.json()) as DatamuseMLI[];
  const closeWords = closeWordsData.map((wordData) => wordData.word);

  return closeWords;
};

const findSynonimsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  const queries = req.query as { word: string };
  const wordSynonims = await findSynonims(queries.word);

  res.status(200).json({ wordSynonims });
};

export default findSynonimsAPI;
