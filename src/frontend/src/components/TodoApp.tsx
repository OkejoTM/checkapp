'use client';

import { useState, useEffect } from 'react';
import { TodoTask, CreateTaskRequest, UpdateTaskRequest } from '@/types';
import { tasksApi } from '@/lib/api';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { Plus, RefreshCw } from 'lucide-react';

export default function TodoApp() {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TodoTask | undefined>();
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await tasksApi.getTasks();
      setTasks(tasksData.filter(task => !task.isDeleted));
    } catch (err) {
      setError('Ошибка при загрузке задач. Проверьте подключение к серверу.');
      console.error('Ошибка загрузки задач:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (data: CreateTaskRequest) => {
    try {
      const newTask = await tasksApi.createTask(data);
      setTasks(prev => [newTask, ...prev]);
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError('Ошибка при создании задачи');
      console.error('Ошибка создания задачи:', err);
    }
  };

  const handleUpdateTask = async (data: UpdateTaskRequest) => {
    if (!editingTask) return;
    
    try {
      const updatedTask = await tasksApi.updateTask(editingTask.id, data);
      setTasks(prev => prev.map(task => task.id === editingTask.id ? updatedTask : task));
      setEditingTask(undefined);
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError('Ошибка при обновлении задачи');
      console.error('Ошибка обновления задачи:', err);
    }
  };

  const handleToggleTask = async (id: string, isCompleted: boolean) => {
    try {
      const updatedTask = await tasksApi.toggleTask(id, isCompleted);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      setError(null);
    } catch (err) {
      setError('Ошибка при изменении статуса задачи');
      console.error('Ошибка переключения задачи:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;
    
    try {
      await tasksApi.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      setError(null);
    } catch (err) {
      setError('Ошибка при удалении задачи');
      console.error('Ошибка удаления задачи:', err);
    }
  };

  const handleEditTask = (task: TodoTask) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const completedTasks = tasks.filter(task => task.isCompleted);
  const activeTasks = tasks.filter(task => !task.isCompleted);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo App</h1>
          <p className="text-gray-600">Управляйте своими задачами</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Всего задач: {tasks.length} | Выполнено: {completedTasks.length}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadTasks}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Обновить</span>
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center space-x-1 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              <span>Новая задача</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Загрузка задач...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Активные задачи</h2>
                <div className="space-y-3">
                  {activeTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Выполненные задачи</h2>
                <div className="space-y-3">
                  {completedTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {tasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">У вас пока нет задач</p>
                <p className="text-gray-400 mt-2">Создайте первую задачу, нажав на кнопку "Новая задача"</p>
              </div>
            )}
          </div>
        )}

        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCloseForm}
          isOpen={isFormOpen}
        />
      </div>
    </div>
  );
}