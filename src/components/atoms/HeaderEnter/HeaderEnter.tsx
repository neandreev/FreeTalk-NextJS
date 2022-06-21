import { FC } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAuth } from '../../../hooks';

import style from './HeaderEnter.module.css';

interface IHeaderEnter {
	handleModalVisible: () => void;
}

const HeaderEnter: FC<IHeaderEnter> = ({ handleModalVisible }) => {
	const { data: session } = useSession();
	
	return (
		<div className={style.headerAction}>
			<span
				className={style.authBtn}
				onClick={!session ? () => signIn() : () => signOut()}
			>
				{session && session.user?.name}
				{session ? 'Выход' : "Вход"}
			</span>
		</div>
	);
};

export { HeaderEnter };
