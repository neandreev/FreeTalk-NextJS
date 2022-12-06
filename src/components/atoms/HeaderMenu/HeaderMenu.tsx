import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { Menu } from 'antd';

const getCurrentKeyMenu = (route: string) => {
  if (route.includes('collections')) return '3';
  if (route.includes('training')) return '2';
  if (route.includes('dictionary')) return '1';
  return '';
};

const HeaderMenu: FC = () => {
  const { route } = useRouter();
  const [currentKeyMenu, setCurrentKeyMenu] = useState(
    getCurrentKeyMenu(route)
  );

  useEffect(() => {
    setCurrentKeyMenu(getCurrentKeyMenu(route));
  }, [route]);

  return (
    <Menu
      mode="horizontal"
      className="header-navigation"
      defaultSelectedKeys={[]}
      selectedKeys={[currentKeyMenu]}
    >
      <Menu.Item className="navigation-item" key="1">
        <Link href="/dictionary">Словарь</Link>
      </Menu.Item>
      <Menu.Item className="navigation-item" key="2">
        <Link href="/training">Тренировка</Link>
      </Menu.Item>
      <Menu.Item className="navigation-item" key="3">
        <Link href="/collections">Коллекции</Link>
      </Menu.Item>
    </Menu>
  );
};

export default HeaderMenu;
