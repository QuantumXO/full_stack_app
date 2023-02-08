import React, { ReactElement } from 'react';
import { axiosInstance } from '../../services';
import { Box, Button } from '@mui/material';

interface IProduct {
  id: number;
  title: string;
}

function CMS(): ReactElement {
  const [products, setProducts] = React.useState<[] | null>(null);
  
  const onAPIRequest = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get('/api');
      console.log('response: ', response);
    } catch (e) {
      console.log(e);
    }
  };
  
  const getProducts = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get('/products');
      
      setProducts(response?.data.products);
    } catch (e) {
      console.log(e);
    }
  };
  
  const privateRequest = async (): Promise<void> => {
    try {
      const res = await axiosInstance.get('/protected');
      
      console.log(res?.data);
    } catch (e) {
      console.error(e);
    }
  };
  
  const publicRequest = async (): Promise<void> => {
    try {
      const res = await axiosInstance.get('/public');
      
      console.log(res?.data);
    } catch (e) {
      console.error(e);
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
    )
  };
  
  return (
    <div className="CMS">
      <header className="CMS-header"></header>
      <Box sx={{ display: 'flex', gap: '24px' }}>
        <Button
          size="medium"
          variant="contained"
          onClick={privateRequest}
        >
          {'Protected request'}
        </Button>
        <Button
          size="medium"
          variant="contained"
          onClick={publicRequest}
        >
          {'Public request'}
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
    </div>
  );
}

export default CMS;