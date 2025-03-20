import api from "../config/axios";
import { LoginFormValues } from "../models/login";

export const loginUser = (values: LoginFormValues) => {  
  return api.post("/api/auth/login", values);
};

export const logout = () => {
  return api.post("/api/auth/logout");
};
export const getProgram = () => {
  return api.get("/api/program");
};
export const joinProgram = (userId: string, programId: string) => {
  return api.post(`/api/program/join`, { userId, programIds: [programId] });
};



