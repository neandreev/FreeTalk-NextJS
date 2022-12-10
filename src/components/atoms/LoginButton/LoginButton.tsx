import { Button } from 'antd';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

import style from './LoginButton.module.css';

interface LoginButtonProps {
  id: string;
  title: string;
  iconSrc: string;
}

const LoginButton = ({ id, title, iconSrc }: LoginButtonProps) => (
  <Button
    shape="round"
    icon={
      <Image src={iconSrc} width={18} height={18} alt={`${id} login icon`} />
    }
    size="large"
    onClick={() => signIn(id)}
    className={style.button}
  >
    {title}
  </Button>
);

export default LoginButton;
