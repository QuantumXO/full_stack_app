import { ComponentType, lazy, LazyExoticComponent, Suspense } from 'react';

export default function lazyLoadRoutes(componentFolder: string) {
  console.log('componentFolder: ', componentFolder);
  // const LazyElement: LazyExoticComponent<ComponentType> = lazy(() => import(componentFolder));
  const LazyElement: LazyExoticComponent<ComponentType> = lazy(() => import('../../view/home'));
  
  // Wrapping around the suspense component is mandatory
  return (
    <Suspense fallback="Loading...">
      <LazyElement />
    </Suspense>
  );
}