import { FC } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

import style from './HeaderEnter.module.css';

const HeaderEnter: FC = () => {
  const { data: session } = useSession();

  return (
    <div className={style['header-action']}>
      <span
        className={style['auth-btn']}
        onClick={!session ? () => signIn() : () => signOut()}
      >
        {session ? 'Выход' : 'Вход'}
      </span>
    </div>
  );
};

export default HeaderEnter;
