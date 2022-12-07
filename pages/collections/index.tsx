import { FC } from 'react';
import superjson from 'superjson';
import { unstable_getServerSession } from 'next-auth';
import { createSSGHelpers } from '@trpc/react/ssg';
import { Collection } from '@prisma/client';

import { GetServerSideProps } from 'next';

import { Row, Col } from 'antd';

import { appRouter } from 'pages/api/trpc/[trpc]';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import trpc from '@/utils/trpc';

import Collections from '@/components/organism/Collections';

import styles from './CollectionsPage.module.css';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson,
  });

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const email = session?.user?.email || null;

  if (!email) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  await ssg.prefetchQuery('collections');

  return {
    props: {
      session,
      trpcState: ssg.dehydrate(),
    },
  };
};

const CollectionsPage: FC = () => {
  const collectionsQuery = trpc.useQuery(['collections']);
  const data = collectionsQuery.data as Collection[];

  return (
    <div style={{ height: '100%' }}>
      <Row>
        <Col span={24}>
          <h1 className={`page__title ${styles.title}`}>
            Предлагаемые коллекции
          </h1>
          <hr />
        </Col>
      </Row>
      <Collections data={data} />
    </div>
  );
};

export default CollectionsPage;
