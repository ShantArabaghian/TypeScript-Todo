import { configureStore } from '@reduxjs/toolkit';
import todoReducer, { TodoState } from './todoSlice';

const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

export type RootState = {
  todos: TodoState;
};

export type AppDispatch = typeof store.dispatch;

export default store;
