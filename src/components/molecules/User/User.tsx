import { FC } from 'react';

import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import style from './User.module.css';

export const User: FC = () => {
	return (
		<div className={style.userWrapper}>
			<p className={style.userName}>Вася Пупкин</p>
			<Avatar
				className={style.user + ' ' + style.avatar}
				icon={<UserOutlined />}
			/>
		</div>
	);
};
