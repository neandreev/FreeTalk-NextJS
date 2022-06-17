import { FC } from 'react';
import { useAuth } from '../../../hooks';

import style from './HeaderEnter.module.css';

interface IHeaderEnter {
	handleModalVisible: () => void;
}

const HeaderEnter: FC<IHeaderEnter> = ({ handleModalVisible }) => {
	const { user, signout } = useAuth()!;

	return (
		<div className={style.headerAction}>
			<span
				className={style.authBtn}
				onClick={user ? signout : handleModalVisible}
			>
				{user ? 'Выход' : 'Вход'}
			</span>
		</div>
	);
};

export { HeaderEnter };
