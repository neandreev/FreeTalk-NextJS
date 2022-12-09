import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { ConfigProvider, Layout } from 'antd';
import localFont from '@next/font/local';

import ruRU from 'antd/lib/locale/ru_RU';

import { AppProps } from 'next/app';

import trpc from '@/utils/trpc';

import Header from '@/components/organism/Header';
import Footer from '@/components/organism/Footer';

import '../src/index.css';

const { Content } = Layout;

const attractive = localFont({
  src: '../src/assets/fonts/attractive.woff2',
});

const antdConfig = {
  token: {
    fontFamily: attractive.style.fontFamily,
  },
};

const FreeTalk = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => (
  <SessionProvider session={session}>
    <ConfigProvider locale={ruRU} theme={antdConfig}>
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

export default trpc.withTRPC(FreeTalk);
