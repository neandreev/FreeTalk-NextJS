import { FC } from 'react';
import { useSession } from 'next-auth/react';

import { Layout } from 'antd';

import HeaderMenu from '../../atoms/HeaderMenu';
import HeaderLogo from '../../atoms/HeaderLogo';
import HeaderEnter from '../../atoms/HeaderEnter';

import style from './Header.module.css';

const { Header: HeaderAnt } = Layout;

const Header: FC = () => {
  const session = useSession();
  const isAuthenticated = session.status === 'authenticated';

  return (
    <HeaderAnt className={style.header}>
      <div className="container">
        <HeaderLogo />
        <HeaderEnter />
        {isAuthenticated && <HeaderMenu />}
      </div>
    </HeaderAnt>
  );
};

export default Header;
