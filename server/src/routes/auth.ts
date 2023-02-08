import { Router } from 'express';
import AuthController from '../controllers/auth';

const authRouter: Router = Router();

authRouter.route('/login').post(AuthController.login);
authRouter.route('/logout').post(AuthController.logout);

export default <Router>authRouter;