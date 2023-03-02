import { Router } from 'express';
import UsersController, { getUser } from '@controllers/common/users';

const router: Router = Router();

router.route('/users/:userId').get(UsersController.getUser);

export default <Router>router;