import superjson from 'superjson';
import { unstable_getServerSession } from 'next-auth/next';

import { GetServerSideProps } from 'next';
import { createSSGHelpers } from '@trpc/react/ssg';

import Translate from 'src/components/organism/Translate';

import { appRouter } from 'pages/api/trpc/[trpc]';
import { authOptions } from './api/auth/[...nextauth]';

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

  return {
    props: {
      session,
      trpcState: ssg.dehydrate(),
    },
  };
};

export const MainPage = () => <Translate />;

export default MainPage;
