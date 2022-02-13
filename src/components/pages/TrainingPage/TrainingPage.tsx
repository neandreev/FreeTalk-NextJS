import { FC, useEffect } from 'react';
import {useAuth} from '../../../hooks/useAuth';

import {Training} from "../../organism/Training";

import './TrainingPage.css';

export const TrainingPage: FC = () => {
  const auth = useAuth();

  useEffect(() => {
    const authenticate = async () => {
      await auth?.signin("mail@neandreev.ru", "123456");
    }


    authenticate();
  }, []);

  console.log('####: auth', auth);

  return (
    <div className='training-page'>
      {
        auth?.user
        ? <Training />
        : null
      }
    </div>
  );
};
