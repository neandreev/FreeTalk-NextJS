import { FC, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Menu } from 'antd';

const HeaderMenu: FC = () => {
	const isRoot = useLocation().pathname === '/';
	const [currentKeyMenu, setCurrentKeyMenu] = useState('');

	useEffect(() => {
		if (isRoot) {
			setCurrentKeyMenu('');
		}
	}, [isRoot]);

	return (
		<Menu
			mode='horizontal'
			className='header-navigation'
			defaultSelectedKeys={[]}
			selectedKeys={[currentKeyMenu]}
			onClick={(e) => setCurrentKeyMenu(e.key)}
		>
			<Menu.Item className='navigation-item' key='1'>
				<Link to='/dictionary'>Словарь</Link>
			</Menu.Item>
			<Menu.Item className='navigation-item' key='2'>
				<Link to='/training'>Тренировка</Link>
			</Menu.Item>
			<Menu.Item className='navigation-item' key='3'>
				<Link to='/collections'>Коллекции</Link>
			</Menu.Item>
		</Menu>
	);
};

export { HeaderMenu };
