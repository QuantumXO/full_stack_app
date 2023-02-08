import { Router } from 'express';
import AuthController from '../controllers/auth';

const testRouter: Router = Router();

testRouter.route('/login').post(AuthController.login);
testRouter.route('/logout').post(AuthController.logout);

export default <Router>testRouter;