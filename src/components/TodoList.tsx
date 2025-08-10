import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  onRename: (todoId: number, newTitle: string) => void;
  deletingTodoIds: number[];
  onToggleStatus: (todoId: number, newStatus: boolean) => void;
  loadingTodoIds: number[];
  loadingAllTodos: boolean;
  setError: (message: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  onRename,
  deletingTodoIds,
  onToggleStatus,
  loadingTodoIds,
  loadingAllTodos,
  setError,
  setLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onRename={onRename}
          isDeleting={deletingTodoIds.includes(todo.id)}
          onToggleStatus={onToggleStatus}
          isLoading={loadingTodoIds.includes(todo.id)}
          loading={loadingAllTodos}
          setError={setError}
          setLoading={setLoading}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isTemp
          onDelete={() => {}}
          onToggleStatus={() => {}}
          onRename={onRename}
          setError={setError}
          setLoading={setLoading}
        />
      )}
    </section>
  );
};
