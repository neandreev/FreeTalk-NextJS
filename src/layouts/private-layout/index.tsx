import {FC} from 'react';

import {Layout} from 'antd';

const {Content} = Layout;

export const AppPrivateLayout: FC = ({children}) => {
	return (
		<Content className='page__layout layout__min-height'>
			<div>{children}</div>
		</Content>
	);
};
