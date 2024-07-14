import { Provider } from "react-redux";
import store from "./store";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import "./App.scss";
const App = () => {
  return (
    <Provider store={store}>
      <div className="container">
        <h1>Todo App</h1>
        <TodoForm />
        <TodoList />
      </div>
    </Provider>
  );
};

export default App;
