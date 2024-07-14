import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addTodo, moveTodoToOverdue } from "../store/todoSlice";
import { v4 as uuidv4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type TodoFormInputs = {
  text: string;
  desc?: string;
  deadline: string | null;
};

const schema = yup.object().shape({
  text: yup
    .string()
    .required("Please Enter a Task")
    .min(3, "Minimum 3 characters"),
  desc: yup.string().notRequired(),
  deadline: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .default(null),
});

export default function TodoForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormInputs>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      text: "",
      desc: "",
      deadline: null,
    },
  });
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<TodoFormInputs> = (data) => {
    dispatch(
      addTodo({
        id: uuidv4(),
        text: data.text,
        desc: data.desc || "",
        deadline: data.deadline,
        completed: false,
      })
    );
    dispatch(moveTodoToOverdue());
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="todo-form">
      <div className="inputs">
        <input {...register("text")} placeholder="Task" />
        {errors.text && <p>{errors.text.message}</p>}
        <input {...register("desc")} placeholder="Description (optional)" />
        {errors.desc && <p>{errors.desc.message}</p>}
        <input
          type="date"
          {...register("deadline")}
          placeholder="Deadline (optional)"
        />
        {errors.deadline && <p>{errors.deadline.message}</p>}
        <button type="submit">Add Todo</button>
      </div>
    </form>
  );
}
