<h1 align='center'>
	FreeTalk
</h1>

<p align='center'>
	<img alt="Code Climate maintainability" src="https://img.shields.io/codeclimate/maintainability-percentage/neandreev/FreeTalk-NextJS?label=CodeClimate&style=flat-square">
	<img alt="CodeFactor Grade" src="https://img.shields.io/codefactor/grade/github/neandreev/freetalk-nextjs?label=CodeFactor&style=flat-square">
	<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/neandreev/FreeTalk-NextJS?label=Last%20commit&style=flat-square">
</p>

<h4 align='center'>
	Сайт-сервис для перевода, изучения и повторения иностранных слов.
</h4>

<h4 align='center'>
	Ссылка: <a href="https://free-talk-next-js.vercel.app" target="_blank">https://free-talk-next-js.vercel.app</a>
</h4>

<div align='center'>

![PageSpeed](https://gist.githubusercontent.com/neandreev/d92e2b7e58dd903a609271efa20f745c/raw/4b2193c41f3e438bfb62dadfd3f82ac76bdf11f9/pagespeed.svg)

</div>

> [![screenshot][1]][1]

  [1]: https://www.neandreev.ru/images/FreeTalk.webp

Форк https://github.com/neandreev/FreeTalk с мажорными изменениями стека:

-	[Create React App](https://create-react-app.dev) ==> [NextJS](https://nextjs.org)
	- Позволил имплементировать Server-Side Rendering
	- Избавил от React-Router
	- Изначально содержит в себе множество способов оптимизации производительности приложения
- [Firebase Authentication](https://firebase.google.com/docs/auth) + кастомный useAuth ==> [NextAuth](https://next-auth.js.org)
	- Позволяет авторизовываться через OAuth посредством встроенных провайдеров (от Google до VK)
	- Остается возможность авторизовываться через почту посредством [Nodemailer](https://nodemailer.com/about/)
	- Хранение пользователей нативно встроено посредством возможности подключения адаптеров к популярным базам данных
- [Firebase Database](https://firebase.google.com/docs/database) ==> [Prisma](https://www.prisma.io) + [PlanetScale](https://planetscale.com)
	- Переход с ограниченной JSON базы данных на MySQL-совместимую базу данных PlanetScale позволил более точно описать объекты предметной области, и также намного удобнее изменять и получать данные из базы данных.
	- В отличие от популярных ORM, Prisma позволяет описывать модели приложения декларативно и просто (в форме [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema))
	- Описывал модели приложения через Prisma, я также автоматически получаю их TypeScript типы, что приятно)
- [Redux RTK Query](https://redux-toolkit.js.org/rtk-query/overview) ==> [tRPC](https://trpc.io)
	- Server-Side Rendering не имел бы никакой пользы если бы я не мог производить префетчинг данных перед выдачей страницы пользователю, а RTK Query по своей природе этого не умеет
	- tRPC же в свою очередь может работать на сервере, а также нативно работает с NextJS
	- TypeScript-совместим
-	В процессе размышления: [Redux Toolkit](https://redux-toolkit.js.org) ==> [Zustand](https://github.com/pmndrs/zustand)
	-	RTK Query больше не нужен, а он - очень большой довод в пользу Redux
	- Zustang позволяет писать store'ы с намного меньшим boilerplate-кодом, при этом не лишая всего функционала redux
	- Придётся отдельно подключать [Immer](https://github.com/immerjs/immer) ибо к его встроенной поддержке в Redux привыкаешь
	- Просто интересно потыкать Zustang, но переписывать store'ы всех модулей приложения...
