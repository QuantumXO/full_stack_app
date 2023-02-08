import React from 'react';
import { createRoot } from 'react-dom/client';
import router from './view/router';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux'
import { store } from './store';

const root = createRoot(
  document.querySelector('#root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider
        router={router}
        fallbackElement={<div>Loading...</div>}
      />
    </Provider>
  </React.StrictMode>
);
