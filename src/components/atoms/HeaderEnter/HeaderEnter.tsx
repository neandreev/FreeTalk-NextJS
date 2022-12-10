import { FC, useState } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';

import LoginModal from '@/components/organism/LoginModal';
import style from './HeaderEnter.module.css';

const HeaderEnter: FC = () => {
  const { data: session } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={style['header-action']}>
      <LoginModal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
      <span
        className={style['auth-btn']}
        onClick={() => (!session ? setIsModalOpen(true) : signOut())}
      >
        {session ? 'Выход' : 'Вход'}
      </span>
    </div>
  );
};

export default HeaderEnter;
