import { Router } from 'express';
import authRouter from './auth';
import testRouter from './test';
import notificationsRouter from '././common/notifications';

const rootRouter: Router = Router();

rootRouter.use(authRouter);
rootRouter.use(testRouter);
rootRouter.use(notificationsRouter);

export default <Router>rootRouter;