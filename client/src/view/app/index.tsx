import React, { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Header from './components/header';

function App(): ReactElement {
  
  return (
    <div className="app">
      <Header />
      <ToastContainer/>
      <main style={{ marginTop: '24px' }}>
        <Outlet/>
      </main>
    </div>
  );
}

export default App;