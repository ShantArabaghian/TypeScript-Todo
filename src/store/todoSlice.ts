import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
  id: string;
  text: string;
  desc?: string;
  deadline: string | null;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  deletedTodos: Todo[];
  overdue: Todo[];
}

const initialState: TodoState = {
  todos: [],
  deletedTodos: [],
  overdue: []
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      const todoToDelete = state.todos.find((todo) => todo.id === action.payload);
      if (todoToDelete) {
        state.deletedTodos.push(todoToDelete);
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      }
    },
    editTodo: (state, action: PayloadAction<{ id: string; text?: string; desc?: string; deadline?: string | null }>) => {
      const todoToEdit = state.todos.find((todo) => todo.id === action.payload.id);
      if (todoToEdit) {
        if (action.payload.text !== undefined) todoToEdit.text = action.payload.text;
        if (action.payload.desc !== undefined) todoToEdit.desc = action.payload.desc;
        if (action.payload.deadline !== undefined) todoToEdit.deadline = action.payload.deadline;
      }
    },
    moveTodoToOverdue: (state) => {
      const currentDate = new Date();
      console.log("Current Date:", currentDate);
      const overdueTodos = state.todos.filter((todo) => {
        const isOverdue = todo.deadline && currentDate > new Date(todo.deadline);
        if (isOverdue) console.log("Overdue Todo:", todo);
        return isOverdue;
      });
      state.overdue.push(...overdueTodos);
      state.todos = state.todos.filter((todo) => !todo.deadline || currentDate <= new Date(todo.deadline));
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo, editTodo, moveTodoToOverdue } = todoSlice.actions;

export default todoSlice.reducer;
