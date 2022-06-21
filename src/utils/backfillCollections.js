import { prisma } from "../server/db";
import axios from 'axios';

const backfillCollections = async () => {
	const collectionsResponse = await axios.get('https://freetalk2022-default-rtdb.firebaseio.com/collections.json');
	const { data: collections } = collectionsResponse;

	Object.values(collections).forEach(async (collection) => {
		const collectionDb = await prisma.collection.findFirst({
			where: {
				title: collection.title,
			}
		});


		const words = collection.words;
		const wordsForDb = words.map((word) => ({
			en: word.word,
			ru: word.translation,
			category: collectionDb.title,
			collectionId: collectionDb.id,
			image: word.imageURL,
		}));

		const added = await prisma.collectionWord.createMany({
			data: wordsForDb,
		})

	})
};

backfillCollections();
