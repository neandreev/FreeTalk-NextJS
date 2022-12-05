import { FC, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

import { Layout } from 'antd';

import LoginModalForm from '../LoginModalForm';
import HeaderMenu from '../../atoms/HeaderMenu';
import HeaderLogo from '../../atoms/HeaderLogo';
import HeaderEnter from '../../atoms/HeaderEnter';

import style from './Header.module.css';

const { Header: HeaderAnt } = Layout;

const Header: FC = () => {
  const session = useSession();
  const isAuthenticated = session.status === 'authenticated';

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
  }, [setIsModalVisible]);

  return (
    <HeaderAnt className={style.header}>
      <div className="container">
        <HeaderLogo />
        <HeaderEnter />
        {isAuthenticated && <HeaderMenu />}
        <LoginModalForm
          isModalVisible={isModalVisible}
          handleCloseModal={handleCloseModal}
        />
      </div>
    </HeaderAnt>
  );
};

export default Header;
