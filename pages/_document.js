import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang='ru'>
			<Head>
				<meta name='description' content='Сайт-сервис для изучения иностранных слов' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
