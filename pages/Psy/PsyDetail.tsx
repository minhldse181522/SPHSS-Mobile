import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Appointment } from "../../models/appointment";
import {
  createAppointment,
  getListAppointments,
} from "../../service/booking/api";
import { RootStackParamList } from "../../utils/routes";
import DatePicker from "react-native-date-picker";

interface User {
  id: number;
  email: string;
  firstName: string;
  gender: string;
  image: string;
  lastName: string;
  phone: string;
  userCode: string;
  username: string;
}

type PsyDetailProps = NativeStackScreenProps<RootStackParamList, "PsyDetail">;

const PsyDetail: React.FC<PsyDetailProps> = ({ route, navigation }) => {
  const { doctor } = route.params;
  const [appointment, setAppointment] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const currentDate = dayjs().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const daysOfWeek = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userData");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<AntDesign key={i} name="star" size={24} color="#27548A" />);
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getListAppointments(doctor.id);
        const data = res.data.data;
        setAppointment(data);
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: "Error fetching appointments:",
          text1Style: { textAlign: "center", fontSize: 16 },
        });
      }
    };
    fetchAppointments();
  }, [doctor.id]);

  const handleSelectAppointment = (item: Appointment) => {
    setSelectedAppointment(item);
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    if (!selectedAppointment) return;

    if (!user) {
      Toast.show({
        type: "error",
        text1: "User data not found!",
        text1Style: { textAlign: "center", fontSize: 16 },
      });
      return;
    }

    const payload = {
      user_id: Number(user.id),
      appointments: [
        {
          time_slot_id: Number(selectedAppointment.time_slot_id),
          notes: "Lịch hẹn tư vấn",
          date: dayjs(selectedDate).toISOString(),
        },
      ],
    };

    try {
      await createAppointment(payload);
      Toast.show({
        type: "success",
        text1: "Đặt lịch thành công!",
        text1Style: { textAlign: "center", fontSize: 16 },
      });
      setModalVisible(false);
    } catch (error: any) {
      console.error(
        "Error creating appointment:",
        error?.response?.data?.message
      );
      const errMessage = error?.response?.data?.message || error.message;
      Toast.show({
        type: "error",
        text1: errMessage,
        text1Style: { textAlign: "center", fontSize: 16 },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Phần bác sĩ */}
        <View style={{ padding: 5 }}>
          <View style={styles.doctorCard}>
            <Image
              source={{ uri: doctor.image }}
              style={{ width: 100, height: 100, borderRadius: 100 }}
            />
            <View>
              <Text style={{ marginTop: 10, fontSize: 18, marginLeft: 20 }}>
                {doctor.firstName + " " + doctor.lastName}
              </Text>
              <Text style={{ marginTop: 5, fontSize: 18, marginLeft: 20 }}>
                Chuyên viên tư vấn tâm lý
              </Text>
              {renderStars()}
            </View>
          </View>
        </View>

        {/* Phần lịch hẹn  */}
        <View style={{ padding: 5, marginTop: 5 }}>
          <View style={styles.appointmentCard}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Lịch tư vấn
              </Text>
              <Text
                style={{ color: "#ec744a", fontSize: 18, fontWeight: "bold" }}
              >
                60 Phút
              </Text>
            </View>
            <TextInput
              style={styles.input}
              value={`${daysOfWeek[dayjs().day()]} ${dayjs().format("DD/MM")}`}
              editable={false}
            />
            <View style={styles.appointmentListContainer}>
              {appointment.map((item) => (
                <TouchableOpacity
                  key={item.time_slot_id.toString()}
                  style={styles.appointmentOption}
                  onPress={() => handleSelectAppointment(item)}
                >
                  <View style={styles.appointmentInfo}>
                    <Text>{item.start_time + " - " + item.end_time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Xác nhận lịch hẹn</Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Bác sĩ: {doctor.firstName} {doctor.lastName}
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Thời gian: {selectedAppointment?.start_time} -{" "}
                {selectedAppointment?.end_time}
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Khách hàng:{" "}
                {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Điện thoại: {user ? user.phone : "N/A"}
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Email: {user ? user.email : "N/A"}
              </Text>
              <TextInput
                style={styles.inputModal}
                value={selectedDate}
                editable={false}
              />
              <View style={styles.dateButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    dayjs(selectedDate).isSameOrBefore(currentDate, "day") &&
                      styles.disabledButton, // Vô hiệu hóa khi bằng ngày hiện tại
                  ]}
                  onPress={() => {
                    if (
                      !dayjs(selectedDate).isSameOrBefore(currentDate, "day")
                    ) {
                      setSelectedDate(
                        dayjs(selectedDate)
                          .subtract(1, "day")
                          .format("YYYY-MM-DD")
                      );
                    }
                  }}
                  disabled={dayjs(selectedDate).isSameOrBefore(
                    currentDate,
                    "day"
                  )}
                >
                  <Text style={styles.dateButtonText}>Giảm ngày</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() =>
                    setSelectedDate(
                      dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD")
                    )
                  }
                >
                  <Text style={styles.dateButtonText}>Tăng ngày</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.buttonText}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  doctorCard: {
    padding: 12,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  starsContainer: {
    marginTop: 5,
    marginLeft: 20,
    fontSize: 18,
    flexDirection: "row",
    marginBottom: 8,
  },
  appointmentCard: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  input: {
    width: 360,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    marginBottom: 15,
  },
  appointmentListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-start",
  },
  appointmentOption: {
    width: 110,
    marginRight: 8,
  },
  appointmentInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  inputModal: {
    textAlign: "center",
    fontSize: 18,
    width: 200,
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Làm tối nền xung quanh modal
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#27548A", // Màu sắc chủ đạo
    textAlign: "center",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
  confirmButton: {
    backgroundColor: "#2ecc71",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  increaseDateButton: {
    marginTop: 15,
    backgroundColor: "#3498db", // Màu xanh dương đẹp
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8, // Bo góc nhẹ
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Tạo hiệu ứng nổi trên Android
  },
  increaseDateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  dateButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 15,
  },
  dateButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  disabledButton: {
    backgroundColor: "#bdc3c7", // Xám nhạt khi bị vô hiệu hóa
    elevation: 0, // Không có bóng đổ
  },
});

export default PsyDetail;
