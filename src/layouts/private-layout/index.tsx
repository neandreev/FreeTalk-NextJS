import {FC} from 'react';

import {Layout} from 'antd';

import styles from './PrivateLayout.module.css';

const {Content} = Layout;

export const AppPrivateLayout: FC = ({children}) => {
	return (
		<Layout className={styles.privateLayout}>
			<Content>
				<div>{children}</div>
			</Content>
		</Layout>
	);
};
