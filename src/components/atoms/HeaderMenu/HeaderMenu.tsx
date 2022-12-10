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

  const menuItems = [
    {
      key: '1',
      label: <Link href="/dictionary">Словарь</Link>,
    },
    {
      key: '2',
      label: <Link href="/training">Тренировка</Link>,
    },
    {
      key: '3',
      label: <Link href="/collections">Коллекции</Link>,
    },
  ];

  return (
    <Menu
      mode="horizontal"
      className="header-navigation"
      defaultSelectedKeys={[]}
      selectedKeys={[currentKeyMenu]}
      items={menuItems}
    />
  );
};

export default HeaderMenu;
