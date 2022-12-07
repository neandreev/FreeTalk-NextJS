import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { ConfigProvider, Layout } from 'antd';

import ruRU from 'antd/lib/locale/ru_RU';

import { AppProps } from 'next/app';

import trpc from '@/utils/trpc';

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

export default trpc.withTRPC(FreeTalk);
