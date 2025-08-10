import React, { useEffect, useRef, useState } from 'react';
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
  onRename: (todoId: number, newTitle: string) => void;
  setError: (message: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TodoItem: React.FC<Props> = ({
  todo: { completed, id, title },
  isTemp = false,
  onDelete,
  isDeleting,
  onToggleStatus,
  isLoading,
  loading,
  editingTodoId,
  setEditingTodoId,
  onRename,
  setError,
  setLoading,
}) => {
  const isEditing = editingTodoId === id;
  const [editedTitle, setEditedTitle] = useState(title);
  const editInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => editInputRef.current?.focus(), 0);
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleEditSubmit = async (): Promise<boolean> => {
    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      try {
        setLoading(true);
        await onDelete(id);

        return true;
      } catch {
        setError('Unable to delete a todo');
        setTimeout(() => setError(''), 3000);

        return false;
      } finally {
        setLoading(false);
      }
    }

    if (trimmedTitle === title) {
      return true;
    }

    try {
      setLoading(true);
      await onRename(id, trimmedTitle);

      return true;
    } catch {
      setError('Unable to update a todo');

      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
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
        <form
          onSubmit={async e => {
            e.preventDefault();
            const ok = handleEditSubmit();

            if (await ok) {
              setEditingTodoId(null);
            } else {
              editInputRef.current?.focus();
            }
          }}
        >
          <input
            ref={editInputRef}
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={editedTitle}
            onChange={handleTitleChange}
            onKeyUp={handleKeyUp}
            onBlur={async () => {
              if (editedTitle.trim() === title) {
                setEditingTodoId(null);

                return;
              }

              if (isEditing) {
                setEditingTodoId(null);
              } else {
                editInputRef.current?.focus();
              }
            }}
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
