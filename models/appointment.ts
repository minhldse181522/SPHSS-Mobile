export interface Appointment {
  time_slot_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  status: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
export interface Appointmentt {
  appointment_id: string;
  firstNamePys: string;
  lastNamePys: string;
  status: string;
  date: string;
  start_time: string;
  end_time: string;
  linkMeeting?: string;
}
export interface AppointmentUpdateValue {
  status: string;
  linkMeeting?: string;
}
