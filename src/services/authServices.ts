import type { LoginPayload, RegisterPayload } from "../types/authTypes";
import axios from "./serviceClientConfig";

export const registerUser = (payload: RegisterPayload) => {
  return axios.post("/user", payload);
};

export const loginUser = (payload: LoginPayload) => {
  return axios.post("/user/login", payload);
};

export const getUser = () => {
  return axios.get("/user/me");
};

export const logoutUser = () => {
  return axios.post("/user/logout");
};
