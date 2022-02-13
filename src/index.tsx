import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './App';
import { store } from './store';

import { ProvideAuth } from './hooks/useAuth';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <ProvideAuth>
      <Provider store={store}>
        <App />
      </Provider>
    </ProvideAuth>
  </React.StrictMode>,
  document.getElementById('root')
);
