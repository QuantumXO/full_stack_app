import { Router } from 'express';
import AuthController from '@controllers/common/auth';

const authRouter: Router = Router();

authRouter.route('/login').post(AuthController.login);
authRouter.route('/logout').post(AuthController.logOut);
authRouter.route('/sign-up').post(AuthController.signUp);

export default <Router>authRouter;