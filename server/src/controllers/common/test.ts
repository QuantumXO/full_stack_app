import { Request, Response } from 'express';
import axios from 'axios';

export async function api(req: Request, res: Response): Promise<void> {
  try {
    res.send('/api [GET]');
  } catch (e) {
    console.log('/api e: ', e);
  }
}

export async function publicRoute(req: Request, res: Response): Promise<void> {
  res.status(200).json({ message: 'Public route!' });
}

export async function protectedRoute(req: Request, res: Response): Promise<void> {
  res.status(200).json({ message: 'Protected route!' });
}

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const response = await axios.get('https://dummyjson.com/products');
    
    res.status(200).json(response?.data);
  } catch (e) {
    console.log(e);
  }
}

export default {
  getProducts,
  publicRoute,
  protectedRoute,
  api,
};