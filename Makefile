install:
	pnpm install
	pnpx prisma generate

develop:
	pnpm dev

build:
	pnpm build

start:
	pnpm start

bstart:
	pnpm build
	pnpm start

lint:
	npx eslint . --ext .js,.jsx,.ts,.tsx

stylelint:
	npx stylelint "**/*.css"

