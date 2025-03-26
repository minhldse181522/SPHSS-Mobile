import { Doctor } from "../models/doctor";
import { Program } from "../models/program";

// Định nghĩa type cho tất cả các route trong ứng dụng
export type RootStackParamList = {
  home: undefined; // undefined nghĩa là màn hình không có parameter
  AppNavigation: undefined;
  program: undefined;
  Psy: undefined;
  PsyDetail: { doctor: Doctor };
  ChatApp: undefined;
  ProgramDetail: { program: Program };
  SurveyDetail: { surveyId: string };
  Login: undefined;
  Profile: undefined;
  AppointmentReport: { appointmentId: string };
};

// Type cho History Tab Navigator
export type HistoryTabParamList = {
  SurveyHistory: undefined;
  ProgramHistory: undefined;
  AppointmentSchedule: undefined;
  ProgramDetail: { program: Program }; // Add ProgramDetail to History Tab Navigator
  AppointmentReport: { appointmentId: string }; // Add AppointmentReport to History Tab Navigator
};

// Type cho Bottom Tab Navigator
export type TabParamList = {
  Home: undefined;
  Survey: undefined;
  Psychologist: undefined;
  History: undefined;
  Menu: undefined;
};

// Type cho Drawer Navigator
export type DrawerParamList = {
  HomeTabs: undefined;
  Program: undefined;
  Profile: undefined;
  ChatApp: undefined;
};
