import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import router from '@view/router';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import '@services/i18n';
import ErrorBoundary from '@view/common/error-boundary';
import { SocketProvider } from '@view/common/contexts/socket';
// import '@services/socket';

const root = createRoot(
  document.querySelector('#root') as HTMLElement
);

root.render(
  // <StrictMode>
  <ErrorBoundary>
    <Provider store={store}>
      <SocketProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider
            router={router}
            fallbackElement={<div>Loading...</div>}
          />
        </Suspense>
      </SocketProvider>
    </Provider>
  </ErrorBoundary>
  // </StrictMode>
);