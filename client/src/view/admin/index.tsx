import React, { ReactElement } from 'react';
import { httpRequest } from '@services/common/axios';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { get } from 'lodash';
import link from '@services/link';

interface IProduct {
  id: number;
  title: string;
}

function Admin(): ReactElement {
  const { t } = useTranslation();
  const [products, setProducts] = React.useState<[] | null>(null);
  
  const onAPIRequest = async (): Promise<void> => {
    try {
      const response = await httpRequest({ method: 'GET', url: '/api' });
      console.log('response: ', response);
    } catch (e) {
      console.log(e);
    }
  };
  
  const getProducts = async (): Promise<void> => {
    try {
      const response = await httpRequest({ method: 'GET', url: '/products' });
      setProducts(get(response, 'data.products', []));
    } catch (e) {
      console.log(e);
    }
  };
  
  const renderProducts = (): ReactElement => {
    return (
      <div>
        {!products
          ? <p>{'No products yet'}</p>
          : (
            <div>
              {products.map((item: IProduct): ReactElement => {
                return (
                  <div key={item.id}>
                    {item.title}
                  </div>
                );
              })}
            </div>
          )
        }
      </div>
    );
  };
  
  return (
    <Box className="Admin" width="100%" padding="0 24px">
      <Typography
        component="h1"
        variant="h3"
        width="100%"
        align="center"
      >
        {t('Admin page')}
      </Typography>
      <Box sx={{ display: 'flex', gap: '24px' }}>
        <Button
          to={link.getUrl.todo()}
          size="medium"
          variant="contained"
          component={RouterLink}
        >
          {'TO do list'}
        </Button>
        <Button
          size="medium"
          variant="contained"
          onClick={getProducts}
        >
          {'Get products'}
        </Button>
        <Button
          size="medium"
          variant="contained"
          onClick={onAPIRequest}
        >
          {'/api'}
        </Button>
      </Box>
      {renderProducts()}
    </Box>
  );
}

export default Admin;