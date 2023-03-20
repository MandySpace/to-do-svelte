export type TaskType = {
  _id: string;
  description: string;
  completed: boolean;
};

export type TaskPayload = {
  description: string;
};

export enum TasksToDisplayEnum {
  COMPLETED = "completed",
  PENDING = "pending",
}
