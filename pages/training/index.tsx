import { GetServerSidePropsContext } from 'next';
import { FC } from 'react';
import { createSSGHelpers } from '@trpc/react/ssg';
import superjson from 'superjson';

import Training from '../../src/components/organism/Training';
import { appRouter } from '../api/trpc/[trpc]';
import { getSession } from 'next-auth/react';

// import style from './TrainingPage.module.css'; //TODO: import TrainingPage style

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

const TrainingPage: FC = () => (
	<div>
		<Training />
	</div>
);

export default TrainingPage;
