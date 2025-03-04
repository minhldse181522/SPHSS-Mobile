import api from "../config/axios";
import { LoginFormValues } from "../models/login";

export const loginUser = (values: LoginFormValues) => {
  return api.post("/api/login", values);
};

export const logout = () => {
  return api.post("/api/logout");
};
