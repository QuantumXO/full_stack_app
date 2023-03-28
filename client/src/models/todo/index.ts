export type TodoPriorityType = 'high' | 'low' | 'medium';

export interface ITodo {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isComplete?: boolean;
  priority?: TodoPriorityType;
}