import {FC} from 'react';

import { User } from '../../molecules/User';

import Logo from './assets/Logo.png';

import { Layout, Menu } from 'antd';

import style from './Header.module.css';

const { Header: HeaderAnt } = Layout;

export const Header: FC = () => {
	return (
		<HeaderAnt>
			<div className={style.logoWrapper}>
				<img src={Logo} alt='FreeTalk' className={style.logo} />
			</div>
			<div className={style.user}>
				<User />
			</div>
			<Menu theme='dark' mode='horizontal' defaultSelectedKeys={['1']}>
				<Menu.Item key='1'>Перевести</Menu.Item>
				<Menu.Item key='2'>Словарь</Menu.Item>
				<Menu.Item key='3'>Тренировка</Menu.Item>
				<Menu.Item key='4'>Коллекции</Menu.Item>
			</Menu>
		</HeaderAnt>
	);
};
