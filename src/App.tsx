import { FC } from 'react';

import { AppRoutes } from './app/routes';

import './app/styles/page.css';

export const App: FC = () => {
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
};
