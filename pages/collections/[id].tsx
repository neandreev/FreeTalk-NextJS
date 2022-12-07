import superjson from 'superjson';
import { unstable_getServerSession } from 'next-auth';
import { createSSGHelpers } from '@trpc/react/ssg';
import { Collection } from '@prisma/client';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { appRouter } from 'pages/api/trpc/[trpc]';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import trpc from '@/utils/trpc';

import DetailCollection from '../../src/components/organism/DetailCollection';

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

  const collectionId = context.params?.id as string;
  await ssg.prefetchQuery('collections');
  await ssg.prefetchQuery('collection-words', +collectionId);

  return {
    props: {
      collectionId: +collectionId,
      session,
      trpcState: ssg.dehydrate(),
    },
  };
};

const DetailCollectionPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { collectionId } = props;

  const collectionWords = trpc.useQuery(['collections']);
  const data = collectionWords.data as Collection[];

  return (
    <div style={{ height: '100%' }}>
      <DetailCollection pid={collectionId} data={data} />
    </div>
  );
};

export default DetailCollectionPage;
