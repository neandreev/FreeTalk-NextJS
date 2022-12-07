import { FC } from 'react';
import superjson from 'superjson';
import { unstable_getServerSession } from 'next-auth';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';

import { GetServerSideProps } from 'next';

import { appRouter } from '@/server/routers/_app';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import Training from '@/components/organism/Training';

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

  await ssg.words.prefetch(email);

  return {
    props: {
      session,
      trpcState: ssg.dehydrate(),
    },
  };
};

const TrainingPage: FC = () => (
  <div>
    <Training />
  </div>
);

export default TrainingPage;
