import React, { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Box } from '@mui/material';

import 'react-toastify/dist/ReactToastify.css';

import Header from './components/header';

function App(): ReactElement {
  
  return (
    <div className="app">
      <Header />
      <ToastContainer
        autoClose={2000}
      />
      <main style={{ marginTop: '24px' }}>
        <Box sx={{ display: 'flex' }}>
          <Outlet/>
        </Box>
      </main>
    </div>
  );
}

export default App;