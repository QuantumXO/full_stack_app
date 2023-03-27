import { Router } from 'express';
import TodoController from '@controllers/todo';

const router: Router = Router();

router.route('/todos').get(TodoController.getTodos);

export default <Router>router;