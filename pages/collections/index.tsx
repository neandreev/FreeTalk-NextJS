import { FC } from 'react';

import { useGetCollectionsQuery } from '../../src/services/collections';

import { Collections } from '../../src/components/organism/Collections/Collections';

import { Row, Col, Spin } from 'antd';
import styles from './CollectionsPage.module.css';

import { GetServerSidePropsContext } from 'next';
import { createSSGHelpers } from '@trpc/react/ssg';
import superjson from 'superjson';

import { appRouter } from '../api/trpc/[trpc]';
import { getSession } from 'next-auth/react';
import { trpc } from '../../src/utils/trpc';

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
	await ssg.fetchQuery('collections');

	return {
		props: {
			session,
			trpcState: ssg.dehydrate(),
		},
	};
}

const CollectionsPage: FC = () => {
	const collectionsQuery = trpc.useQuery(['collections']);
	const data = collectionsQuery.data || [];

	return (
		<div style={{ height: '100%' }}>
			{data ? (
				<>
					<Row>
						<Col span={24}>
							<h1 className={`page__title ${styles.title}`}>Предлагаемые коллекции</h1>
							<hr />
						</Col>
					</Row>
					<Collections data={data} />
				</>
			) : (
				<div className={styles.wrapSpinner}>
					<Spin size="large" />
				</div>
			)
		}
		</div>
	);
};

export default CollectionsPage;
