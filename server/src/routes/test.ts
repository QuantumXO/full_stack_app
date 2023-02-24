import { Router } from 'express';
import TestController from '../controllers/test';

const testRouter: Router = Router();

testRouter.route('/api').get(TestController.api);

export default <Router>testRouter;