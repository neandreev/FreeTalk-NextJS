import { NextApiRequest, NextApiResponse } from 'next';

interface DatamuseMLI {
  word: string;
  score: number;
  tags: string[];
}

const findSynonims = async (word: string) => {
  try {
    const result = await fetch(
      `https://api.datamuse.com/words?max=2&rel_syn=${word}`
    );

    const closeWordsData = (await result.json()) as DatamuseMLI[];
    const closeWords = closeWordsData.map((wordData) => wordData.word);

    return { data: closeWords, error: null };
  } catch (e) {
    return { data: [], error: e };
  }
};

const findSynonimsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  const queries = req.query as { word: string };
  const wordSynonimsData = await findSynonims(queries.word);

  res.status(200).json({ wordSynonims: wordSynonimsData.data });
};

export default findSynonimsAPI;
