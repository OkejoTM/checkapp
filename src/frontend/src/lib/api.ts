import axios from 'axios';
import { TodoTask, CreateTaskRequest, UpdateTaskRequest } from '@/types';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tasksApi = {
  // Получить все задачи
  getTasks: async (): Promise<TodoTask[]> => {
    const response = await api.get('/api/tasks');
    return response.data;
  },

  // Получить задачу по ID
  getTask: async (id: string): Promise<TodoTask> => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },

  // Создать новую задачу
  createTask: async (task: CreateTaskRequest): Promise<TodoTask> => {
    const response = await api.post('/api/tasks', task);
    return response.data;
  },

  // Обновить задачу
  updateTask: async (id: string, task: UpdateTaskRequest): Promise<TodoTask> => {
    const response = await api.put(`/api/tasks/${id}`, task);
    return response.data;
  },

  // Удалить задачу
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/api/tasks/${id}`);
  },

  // Переключить статус выполнения задачи
  toggleTask: async (id: string, isCompleted: boolean): Promise<TodoTask> => {
    return tasksApi.updateTask(id, { isCompleted });
  },
};

export default api;