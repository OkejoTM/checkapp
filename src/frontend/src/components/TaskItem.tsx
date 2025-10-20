'use client';

import { TodoTask } from '@/types';
import { Check, Trash2, Edit2 } from 'lucide-react';

interface TaskItemProps {
  task: TodoTask;
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: TodoTask) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  return (
    <div className={`p-4 border rounded-lg shadow-sm bg-white ${task.isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggle(task.id, !task.isCompleted)}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.isCompleted
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            {task.isCompleted && <Check size={12} />}
          </button>
          
          <div className="flex-1">
            <h3 className={`font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`mt-1 text-sm ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              Создано: {new Date(task.createdAt).toLocaleString('ru-RU')}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="Редактировать"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Удалить"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}