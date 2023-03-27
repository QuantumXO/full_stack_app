import { Request, Response } from 'express';
import customError from '@services/custom-error';
import { normalizeResponseBody } from '@services/normalize-response-body';
import { ITodo } from '@interfaces/todo';

const mockTodos: ITodo[] = [
  { id: '111', title: 'test title', content: 'Some todo text...', createdAt: new Date(), position: 0, priority: 'low' },
  { id: '31', title: 'test title', content: 'Some todo text...', createdAt: new Date(), position: 1, priority: 'high' },
];

async function getTodos(req: Request, res: Response): Promise<void> {
  try {
    res
      .status(200)
      .json(normalizeResponseBody({ todos: mockTodos }));
  } catch (e) {
    customError(null, e, true);
  }
}

export default {
  getTodos,
}