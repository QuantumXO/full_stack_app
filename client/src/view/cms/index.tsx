import React, { ReactElement } from 'react';
import { axiosInstance, httpRequest } from '@services/axios';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';

interface IProduct {
  id: number;
  title: string;
}

function CMS(): ReactElement {
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
    <Box className="CMS" width="100%" padding="0 24px">
      <Typography
        component="h1"
        variant="h3"
        width="100%"
        align="center"
      >
        {t('CMS page')}
      </Typography>
      <Box sx={{ display: 'flex', gap: '24px' }}>
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

export default CMS;