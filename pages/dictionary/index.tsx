import { FC } from 'react';
import { getSession } from 'next-auth/react';
import Dictionary from '../../src/components/organism/Dictionary';

import style from './Dictionary.module.css';
import { createSSGHelpers } from '@trpc/react/ssg';
import { appRouter } from '../api/trpc/[trpc]';

import superjson from 'superjson';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const ssg = await createSSGHelpers({
		router: appRouter,
		ctx: {},
		transformer: superjson,
	});

	const session = await getSession(context);
	const email = session?.user?.email || null;

	if (!email) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
	await ssg.fetchQuery('words', email);

	return {
		props: {
			session,
			trpcState: ssg.dehydrate(),
		},
	};
}

export const DictionaryPage: FC = () => {
	return (
		<div>
			<Dictionary />
		</div>
	);
};

export default DictionaryPage;
