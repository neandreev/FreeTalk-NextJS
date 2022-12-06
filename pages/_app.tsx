import Head from 'next/head';
import superjson from 'superjson';
import { withTRPC } from '@trpc/next';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { SessionProvider } from 'next-auth/react';
import { ConfigProvider, Layout } from 'antd';

import ruRU from 'antd/lib/locale/ru_RU';

import { AppProps } from 'next/app';

import { AppRouter } from 'pages/api/trpc/[trpc]';

import Header from '@/components/organism/Header';
import Footer from '@/components/organism/Footer';

import '../src/index.css';

const { Content } = Layout;

const FreeTalk = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => (
  <SessionProvider session={session}>
    <ConfigProvider locale={ruRU}>
      <Head>
        <title>FreeTalk</title>
      </Head>
      <Layout className="layout">
        <Header />
        <Content className="content container">
          <Component {...pageProps} />
        </Content>
        <Footer />
      </Layout>
    </ConfigProvider>
  </SessionProvider>
);

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config() {
    if (typeof window !== 'undefined') {
      return {
        transformer: superjson,
        url: '/api/trpc',
      };
    }

    const url = `${getBaseUrl()}/api/trpc`;

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
      url,
      headers: {
        'x-ssr': '1',
      },
    };
  },
  ssr: true,
  responseMeta({ clientErrors }) {
    if (clientErrors.length) {
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      };
    }

    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
    return {
      headers: {
        'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
      },
    };
  },
})(FreeTalk);
