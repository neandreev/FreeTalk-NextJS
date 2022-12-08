import { FC } from 'react';
import superjson from 'superjson';
import { unstable_getServerSession } from 'next-auth';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { Collection } from '@prisma/client';

import { GetServerSideProps } from 'next';

import { Row, Col } from 'antd';

import { appRouter } from '@/server/routers/_app';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import trpc from '@/utils/trpc';

import Collections from '@/components/organism/Collections';

import styles from './CollectionsPage.module.css';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = await createProxySSGHelpers({
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

  await ssg.collections.prefetch();

  return {
    props: {
      session,
      trpcState: ssg.dehydrate(),
    },
  };
};

const CollectionsPage: FC = () => {
  const collectionsQuery = trpc.collections.useQuery();
  const data = collectionsQuery.data as Collection[];

  return (
    <div style={{ height: '100%' }}>
      <Row>
        <Col span={24}>
          <h1 className={`page-title ${styles.title}`}>
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
