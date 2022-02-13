import React, { FC } from 'react';

import { Layout } from 'antd';
import styles from './PublicLayout.module.css';
const { Content } = Layout;

export const AppPublicLayout: FC = ({ children }) => {
  return (
    <Layout className={styles.publicLayout}>
      <Content>
        <div>{children}</div>
      </Content>
    </Layout>
  );
};
