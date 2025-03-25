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

export const getSurvey = () => {
  return api.get("/api/survey");
};

export const getSurveysAnswerAndQuestion = (id: string) => {
  return api.get(`/api/survey/${id}`);
};

export const getSurveyResultById = (id: string) => {
  return api.get(`/api/survey-result/${id}`);
};

export const submitSurvey = (data: any) => {
  return api.post("/api/survey-result/submit", data);
};

export const getAppointmentSchedule = (userId: string) => {
  return api.get(`/api/appointmentsByUser?user_id=${userId}`);
};
