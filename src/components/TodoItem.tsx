import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  onDelete: (todoId: number) => void;
  isDeleting?: boolean;
  onToggleStatus: (todoId: number, newStatus: boolean) => void;
  isLoading?: boolean;
  loading?: boolean;
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onRename: (todoId: number, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { completed, id, title },
  isTemp = false,
  onDelete,
  isDeleting,
  onToggleStatus,
  isLoading,
  loading,
  inputRef,
  editingTodoId,
  setEditingTodoId,
  onRename,
}) => {
  const isEditing = editingTodoId === id;
  const [editedTitle, setEditedTitle] = useState(title);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isEditing]);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleEditSubmit = () => {
    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle || trimmedTitle === title) {
      setEditingTodoId(null);
      setEditedTitle(title);

      return;
    }

    onRename(id, trimmedTitle);
    setEditingTodoId(null);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleEditSubmit();
    }

    if (event.key === 'Escape') {
      setEditedTitle(title);
      setEditingTodoId(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${completed ? 'completed' : ''}`}
      key={id}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${id}`}>
        {/* {} */}
        <input
          id={`todo-status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            onToggleStatus(id, !completed);
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            ref={inputRef}
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={editedTitle}
            onChange={handleTitleChange}
            onKeyUp={handleKeyUp}
            onBlur={() => setEditingTodoId(null)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setEditingTodoId(id)}
        >
          {title}
        </span>
      )}

      {/* <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span> */}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isTemp || isDeleting || isLoading || loading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
