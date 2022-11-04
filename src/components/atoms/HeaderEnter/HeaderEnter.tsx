import { FC } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

import style from './HeaderEnter.module.css';

const HeaderEnter: FC = () => {
	const { data: session } = useSession();

  console.log(session);

	return (
		<div className={style.headerAction}>
			<span
				className={style.authBtn}
				onClick={!session ? () => signIn() : () => signOut()}
			>
				{session ? 'Выход' : 'Вход'}
			</span>
		</div>
	);
};

export { HeaderEnter };
