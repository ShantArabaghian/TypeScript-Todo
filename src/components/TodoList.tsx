import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  toggleTodo,
  deleteTodo,
  editTodo,
  moveTodoToOverdue,
} from "../store/todoSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";

const TodoList = () => {
  const [showDeletedTodos, setShowDeletedTodos] = useState(false);
  const [editModeId, setEditModeId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const [editedDesc, setEditedDesc] = useState<string>("");
  const [editedDeadline, setEditedDeadline] = useState<string>("");
  const todos = useSelector((state: RootState) => state.todos.todos);
  const deletedTodos = useSelector(
    (state: RootState) => state.todos.deletedTodos
  );
  const overdue = useSelector((state: RootState) => state.todos.overdue);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(moveTodoToOverdue());
  }, [dispatch, todos.length]);

  const toggleDeletedTodosVisibility = () => {
    setShowDeletedTodos(!showDeletedTodos);
  };

  const handleEditStart = (
    id: string,
    initialText: string,
    initialDesc?: string,
    initialDeadline?: string | null
  ) => {
    setEditModeId(id);
    setEditedText(initialText);
    setEditedDesc(initialDesc || "");
    setEditedDeadline(initialDeadline || "");
  };

  const handleEditCancel = () => {
    setEditModeId(null);
  };

  const handleEditSave = (
    id: string,
    newText: string,
    newDesc: string,
    newDeadline: string | null
  ) => {
    if (newText !== "") {
      dispatch(
        editTodo({ id, text: newText, desc: newDesc, deadline: newDeadline })
      );
      dispatch(moveTodoToOverdue());
    }
    setEditModeId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            {editModeId === todo.id ? (
              <div>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  autoFocus
                />
                <input
                  type="text"
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                  placeholder="Description (optional)"
                />
                <input
                  type="date"
                  value={editedDeadline}
                  onChange={(e) => setEditedDeadline(e.target.value)}
                  placeholder="Deadline (optional)"
                />
                <button
                  onClick={() =>
                    handleEditSave(
                      todo.id,
                      editedText,
                      editedDesc,
                      editedDeadline || null
                    )
                  }
                >
                  Save
                </button>
                <button onClick={handleEditCancel}>Cancel</button>
              </div>
            ) : (
              <div>
                <p className={todo.completed ? "completed" : ""}>{todo.text}</p>
                {todo.desc && <h6>{todo.desc}</h6>}
                {todo.deadline && <h6>{formatDate(todo.deadline)}</h6>}
                <div className="actions">
                  <button onClick={() => dispatch(toggleTodo(todo.id))}>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button onClick={() => dispatch(deleteTodo(todo.id))}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    onClick={() =>
                      handleEditStart(
                        todo.id,
                        todo.text,
                        todo.desc,
                        todo.deadline
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <button onClick={toggleDeletedTodosVisibility}>
        {showDeletedTodos ? "Hide Deleted Todos" : "Show Deleted Todos"}
      </button>
      {showDeletedTodos && (
        <div className="deleted-todos">
          <h2>Deleted Todos</h2>
          <ul>
            {deletedTodos.map((todo) => (
              <li key={todo.id}>
                <span>{todo.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {overdue.length > 0 && (
        <div className="overdue-todos">
          <h2>Overdue Todos</h2>
          <ul>
            {overdue.map((todo) => (
              <li key={todo.id}>
                <span>{todo.text}</span>
                {todo.desc && <span>{todo.desc}</span>}
                {todo.deadline && (
                  <span> {formatDate(todo.deadline)} (Deadline passed)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TodoList;
