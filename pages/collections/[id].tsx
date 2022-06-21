import { FC } from 'react';

import { useGetCollectionsQuery } from '../../src/services/collections';
import { DetailCollection } from '../../src/components/organism/DetailCollection';

import { Row, Col, Spin } from 'antd';

import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { createSSGHelpers } from '@trpc/react/ssg';
import superjson from 'superjson';

import { appRouter } from '../api/trpc/[trpc]';
import { getSession } from 'next-auth/react';
import { trpc } from '../../src/utils/trpc';
import { promisify } from 'util';

export async function getServerSideProps(
	context: GetServerSidePropsContext<{ id: string }>
) {
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

	const collectionId = context.params?.id as string;
	await ssg.fetchQuery('collections');
	await ssg.fetchQuery('collection-words', +collectionId)

	return {
		props: {
			collectionId: +collectionId,
			session,
			trpcState: ssg.dehydrate(),
		},
	};
}

const DetailCollectionPage: FC = (
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
	const collectionWords = trpc.useQuery(['collections']);
	const { data } = collectionWords;

	return (
		<div style={{ height: '100%' }}>
			{data ? (
				<DetailCollection pid={props.collectionId} data={data} />
			) : (
				<Row justify='center' align='middle' style={{ height: '100%' }}>
					<Col>
						<Spin size='large' />
					</Col>
				</Row>
			)}
		</div>
	);
};

export default DetailCollectionPage;
