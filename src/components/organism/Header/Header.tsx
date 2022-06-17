import { FC, useState, useCallback } from 'react';

import { Layout } from 'antd';

import { useAuth } from '../../../hooks';

import LoginModalForm from '../LoginModalForm';
import HeaderMenu from '../../atoms/HeaderMenu';
import HeaderLogo from '../../atoms/HeaderLogo';
import HeaderEnter from '../../atoms/HeaderEnter';

import style from './Header.module.css';
import './Header.css';

const { Header: HeaderAnt } = Layout;

export const Header: FC = () => {
	const { user } = useAuth()!;

	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleCloseModal = useCallback(() => {
		setIsModalVisible(false);
	}, [setIsModalVisible]);

	return (
		<HeaderAnt className={style.header}>
			<div className='container'>
				<HeaderLogo />
				<HeaderEnter handleModalVisible={() => setIsModalVisible(true)} />
				{user && <HeaderMenu />}
				<LoginModalForm
					isModalVisible={isModalVisible}
					handleCloseModal={handleCloseModal}
				/>
			</div>
		</HeaderAnt>
	);
};
