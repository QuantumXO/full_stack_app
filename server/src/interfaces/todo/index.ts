export type TodoPriorityType = 'high' | 'low' | 'medium';
export interface ITodo {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  position: number;
  isComplete?: boolean;
  priority?: TodoPriorityType;
}
export interface IDBTodo {
  _id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  position: number;
  isComplete?: boolean;
  priority?: TodoPriorityType;
}