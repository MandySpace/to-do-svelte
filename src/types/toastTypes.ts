export type ToastType = {
  message: string;
  severity: "success" | "warning" | "error";
  duration?: number;
};
