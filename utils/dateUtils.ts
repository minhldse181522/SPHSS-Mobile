import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Kích hoạt plugin để hỗ trợ múi giờ
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Hàm chuyển đổi định dạng ngày từ API về dạng `DD/MM/YYYY`
 * @param dateString
 * @returns
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  return dayjs.utc(dateString).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
};

/**
 * Hàm chuyển đổi định dạng thời gian từ API về dạng `HH:mm`
 * @param timeString
 * @returns
 */
export const formatTime = (timeString?: string): string => {
  if (!timeString) return "";
  return dayjs.utc(timeString).tz("Asia/Ho_Chi_Minh").format("HH:mm");
};
