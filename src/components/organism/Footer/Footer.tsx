import { FC } from 'react';

import { Layout } from 'antd';

import style from './Footer.module.css';

const { Footer: FooterAnt } = Layout;

const Footer: FC = () => (
  <FooterAnt className={style.footer}>
    <div className="container">
      <span className={style.copyright}>©FreeTalk 2022</span>
    </div>
  </FooterAnt>
);

export default Footer;
