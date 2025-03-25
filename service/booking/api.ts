// Luồng đặt lịch
import api from "../../config/axios";

export const getListDoctor = () => {
  return api.get("/api/users/R3");
};

export const getListAppointments = (id: string) => {
  return api.get(`/api/timeSlotByUser?user_id=${id}`);
};

export const createAppointment = (data: any) => {
  return api.post("/api/appointments-array", data);
};
