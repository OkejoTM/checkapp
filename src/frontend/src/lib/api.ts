import axios from 'axios';
import { TodoTask, CreateTaskRequest, UpdateTaskRequest } from '@/types';

// NEXT_PUBLIC_ префикс делает переменную доступной в браузере
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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