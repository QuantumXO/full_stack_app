import { Router } from 'express';
import authRouter from '@routes/common/auth';
import testRouter from '@routes/common/test';
import notificationsRouter from '@routes/common/notifications';
import usersRouter from '@routes/common/users';

const rootRouter: Router = Router();

rootRouter.use(authRouter);
rootRouter.use(testRouter);
rootRouter.use(notificationsRouter);
rootRouter.use(usersRouter);

export default <Router>rootRouter;