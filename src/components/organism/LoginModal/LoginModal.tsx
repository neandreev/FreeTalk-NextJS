import { Modal } from 'antd';

import LoginButton from '@/components/atoms/LoginButton';

import GoogleIcon from './google.svg';
import YandexIcon from './yandex.svg';
import GithubIcon from './github.svg';

import style from './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

interface SignInMethods {
  id: string;
  title: string;
  iconSrc: string;
}

const signInMethodsData: SignInMethods[] = [
  {
    id: 'google',
    title: 'Google',
    iconSrc: GoogleIcon as string,
  },
  {
    id: 'yandex',
    title: 'Yandex',
    iconSrc: YandexIcon as string,
  },
  {
    id: 'github',
    title: 'GitHub',
    iconSrc: GithubIcon as string,
  },
];

const LoginModal = ({ isOpen, handleClose }: LoginModalProps) => (
  <Modal open={isOpen} onCancel={handleClose} title="Войти с помощью:">
    <div className={style.buttons}>
      {signInMethodsData.map(({ id, title, iconSrc }) => (
        <LoginButton key={id} id={id} title={title} iconSrc={iconSrc} />
      ))}
    </div>
  </Modal>
);

export default LoginModal;
