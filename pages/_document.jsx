import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => (
  <Html lang="ru">
    <Head>
      <meta
        name="description"
        content="Сайт-сервис для изучения иностранных слов"
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
