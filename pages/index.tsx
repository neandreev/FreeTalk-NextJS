import superjson from 'superjson';

import { GetServerSidePropsContext } from 'next';
import { createSSGHelpers } from '@trpc/react/ssg';

import { Translate } from 'src/components/organism/Translate';

import { appRouter } from 'pages/api/trpc/[trpc]';

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const ssg = await createSSGHelpers({
		router: appRouter,
		ctx: {},
		transformer: superjson,
	});

	return {
		props: {
			trpcState: ssg.dehydrate(),
		},
	};
}

export const MainPage = () => <Translate />;

export default MainPage;
