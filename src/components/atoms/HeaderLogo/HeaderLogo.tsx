import { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import FreeTalk from '../../../assets/FreeTalk.svg';
import FreeTalkMobile from '../../../assets/FreeTalkMobile.svg';

import style from './HeaderLogo.module.css';

const HeaderLogo: FC = () => (
  <div className={style['logo-wrapper']}>
    <Link href="/">
      <div>
        <div className={style.logo}>
          <Image src={FreeTalk} alt="FreeTalk logo" priority />
        </div>
        <div className={style['logo-mobile']}>
          <Image src={FreeTalkMobile} alt="FreeTalk Mobile logo" priority />
        </div>
      </div>
    </Link>
  </div>
);

export default HeaderLogo;
