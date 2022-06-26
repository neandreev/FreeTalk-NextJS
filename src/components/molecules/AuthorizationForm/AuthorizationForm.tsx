import { FC } from 'react';
import { signIn } from 'next-auth/react';

import { Button } from 'antd';

export const AuthorizationForm: FC = () => (
	<Button onClick={() => signIn()}>Войти</Button>
);
