import { FC } from 'react';

import { Layout } from 'antd';

import style from './Footer.module.css';

const { Footer: FooterAnt } = Layout;

const Footer: FC = () => (
  <FooterAnt className={style.footer}>
    <div className="container">
      <span className={style.copyright}>
        <span>FreeTalk, </span>
        <a href="https://github.com/neandreev/freetalk-nextjs">Open-Source Project</a>
      </span>
    </div>
  </FooterAnt>
);

export default Footer;
