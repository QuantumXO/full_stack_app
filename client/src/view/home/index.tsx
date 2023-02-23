import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Box, Container } from '@mui/material';

function Home(): ReactElement {
  const { t } = useTranslation();
  return (
    <Box className="home" width="100%" padding="0 24px">
      <Typography
        component="h1"
        variant="h3"
        width="100%"
        align="center"
      >
        {t('Home page')}
      </Typography>
      <Container
        component="main"
        maxWidth="xs"
      >
      
      </Container>
    </Box>
  );
}

export default Home;