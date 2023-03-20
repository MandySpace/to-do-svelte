import axios from "./serviceClientConfig";
import type { TaskPayload } from "../types/taskTypes";

export const fetchTasks = (showCompletedTasks: boolean, signal = null) => {
  return axios.get(`/tasks?completed=${showCompletedTasks}`, {
    signal,
  });
};

export const addTask = (payload: TaskPayload) => {
  return axios.post("/task", payload);
};

export const removeTask = (taskId: string) => {
  return axios.delete(`/task/${taskId}`);
};

export const editTask = (taskId: string, completed: boolean) => {
  return axios.patch(`/task/${taskId}`, { completed });
};
