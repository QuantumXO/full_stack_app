import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import router from './view/router';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './services/i18n';
import ErrorBoundary from './view/components/error-boundary';

const root = createRoot(
  document.querySelector('#root') as HTMLElement
);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider
            router={router}
            fallbackElement={<div>Loading...</div>}
          />
        </Suspense>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);