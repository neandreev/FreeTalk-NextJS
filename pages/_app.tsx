import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';
import ruRU from 'antd/lib/locale/ru_RU';

import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';

import type { AppProps } from 'next/app'
import superjson from 'superjson';

import { AppRouter } from './api/trpc/[trpc]';
import { withTRPC } from '@trpc/next';

import { AppType } from 'next/dist/shared/lib/utils';

import { Header } from '../src/components/organism/Header';
import Footer from '../src/components/organism/Footer';
import { Layout } from 'antd';

import '../src/index.css';
import Head from "next/head";

const { Content } = Layout;

const FreeTalk = ({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) => {
	return (
		<SessionProvider session={session}>
			<ConfigProvider locale={ruRU}>
				<Head>
					<title>FreeTalk</title>
				</Head>
				<Layout className='layout'>
					<Header />
						<Content className='content container'>
							<Component {...pageProps} />
						</Content>
					<Footer />
				</Layout>
			</ConfigProvider>
		</SessionProvider>
	);
};

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
	config({ ctx }) {
		if (typeof window !== 'undefined') {
			return {
				transformer: superjson,
				url: '/api/trpc',
			};
		}

		const url = `${getBaseUrl()}/api/trpc`;

		return {
			links: [
        // adds pretty logs to your console in development and logs errors in production
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
	responseMeta({ ctx, clientErrors }) {
		if (clientErrors.length) {
			// propagate http first error from API calls
			return {
				status: clientErrors[0].data?.httpStatus ?? 500,
			};
		}

		// cache request for 1 day + revalidate once every second
		const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
		return {
			headers: {
				'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
			},
		};
	},
})(FreeTalk);
