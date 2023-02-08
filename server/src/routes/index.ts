import { Router } from 'express';
import authRouter from './auth';
import testRouter from './test';

const rootRouter: Router = Router();

rootRouter.use(authRouter);
rootRouter.use(testRouter);

export default <Router>rootRouter;