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
  StatusBar,
  Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import { Appointment } from "../../models/appointment";
import {
  createAppointment,
  getListAppointments,
} from "../../service/booking/api";
import { RootStackParamList } from "../../utils/routes";
import DatePicker from "react-native-date-picker";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";

const { width } = Dimensions.get("window");

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

  const renderStars = (rating = 5) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const color = i < rating ? "#FFC107" : "#E0E0E0";
      stars.push(
        <AntDesign
          key={i}
          name="star"
          size={16}
          color={color}
          style={{ marginRight: 2 }}
        />
      );
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
          date: dayjs(selectedDate).utc().toISOString(),
        },
      ],
    };
    console.log(payload);

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
      <StatusBar backgroundColor="#3674B5" barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#3674B5", "#2A5A8E"]} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin chuyên gia</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Doctor Profile */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: doctor.image }}
              style={styles.doctorImage}
              defaultSource={require("../../assets/Psychologist.png")}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.doctorName}>
                {doctor.firstName + " " + doctor.lastName}
              </Text>
              <Text style={styles.doctorSpecialty}>Chuyên gia tâm lý</Text>
              {renderStars()}
            </View>
          </View>

          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <FontAwesome name="briefcase" size={18} color="#3674B5" />
              <Text style={styles.statValue}>15+</Text>
              <Text style={styles.statLabel}>Năm kinh nghiệm</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <FontAwesome name="users" size={18} color="#3674B5" />
              <Text style={styles.statValue}>1000+</Text>
              <Text style={styles.statLabel}>Khách hàng</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <FontAwesome name="certificate" size={18} color="#3674B5" />
              <Text style={styles.statValue}>100%</Text>
              <Text style={styles.statLabel}>Chứng nhận</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Giới thiệu</Text>
          <Text style={styles.sectionContent}>
            Với hơn 15 năm kinh nghiệm trong lĩnh vực tâm lý học lâm sàng,
            {doctor.firstName + " " + doctor.lastName} chuyên tư vấn và hỗ trợ
            các vấn đề về sức khỏe tinh thần như lo âu, trầm cảm, căng thẳng, và
            các vấn đề liên quan đến mối quan hệ.
          </Text>
        </View>

        {/* Specialties Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Chuyên môn</Text>
          <View style={styles.specialtiesList}>
            <View style={styles.specialtyItem}>
              <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.specialtyText}>Tâm lý học lâm sàng</Text>
            </View>
            <View style={styles.specialtyItem}>
              <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.specialtyText}>
                Điều trị lo âu và trầm cảm
              </Text>
            </View>
            <View style={styles.specialtyItem}>
              <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.specialtyText}>
                Tư vấn tâm lý cho thanh thiếu niên
              </Text>
            </View>
            <View style={styles.specialtyItem}>
              <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.specialtyText}>Quản lý căng thẳng</Text>
            </View>
          </View>
        </View>

        {/* Appointment Section */}
        <View style={styles.sectionCard}>
          <View style={styles.appointmentHeader}>
            <Text style={styles.sectionTitle}>Lịch tư vấn</Text>
            <View style={styles.durationBadge}>
              <Feather name="clock" size={14} color="#FF7043" />
              <Text style={styles.durationText}>60 phút</Text>
            </View>
          </View>

          <View style={styles.dateSelector}>
            <Text style={styles.dateLabel}>Ngày tư vấn</Text>
            <View style={styles.dateDisplay}>
              <Feather
                name="calendar"
                size={18}
                color="#3674B5"
                style={styles.dateIcon}
              />
              <Text style={styles.dateText}>
                {`${daysOfWeek[dayjs().day()]} ${dayjs().format("DD/MM/YYYY")}`}
              </Text>
            </View>
          </View>

          <Text style={styles.timeSlotLabel}>Thời gian có sẵn</Text>

          <View style={styles.timeSlotGrid}>
            {appointment.length > 0 ? (
              appointment.map((item) => (
                <TouchableOpacity
                  key={item.time_slot_id.toString()}
                  style={[
                    styles.timeSlot,
                    selectedAppointment?.time_slot_id === item.time_slot_id &&
                      styles.selectedTimeSlot,
                  ]}
                  onPress={() => handleSelectAppointment(item)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedAppointment?.time_slot_id === item.time_slot_id &&
                        styles.selectedTimeSlotText,
                    ]}
                  >
                    {item.start_time + " - " + item.end_time}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noSlotsText}>
                Không có lịch trống cho ngày hôm nay
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.bookButton,
            !selectedAppointment && styles.disabledButton,
          ]}
          disabled={!selectedAppointment}
          onPress={() => selectedAppointment && setModalVisible(true)}
        >
          <LinearGradient
            colors={["#3674B5", "#2A5A8E"]}
            style={styles.bookButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.bookButtonText}>
              {selectedAppointment
                ? "Đặt lịch ngay"
                : "Vui lòng chọn thời gian"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Booking Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Xác nhận lịch hẹn</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.confirmationItem}>
                <Text style={styles.confirmationLabel}>Chuyên gia:</Text>
                <Text style={styles.confirmationValue}>
                  {doctor.firstName} {doctor.lastName}
                </Text>
              </View>

              <View style={styles.confirmationItem}>
                <Text style={styles.confirmationLabel}>Thời gian:</Text>
                <Text style={styles.confirmationValue}>
                  {selectedAppointment?.start_time} -{" "}
                  {selectedAppointment?.end_time}
                </Text>
              </View>

              <View style={styles.confirmationItem}>
                <Text style={styles.confirmationLabel}>Khách hàng:</Text>
                <Text style={styles.confirmationValue}>
                  {user ? `${user.firstName} ${user.lastName}` : "Đang tải..."}
                </Text>
              </View>

              <View style={styles.confirmationItem}>
                <Text style={styles.confirmationLabel}>Điện thoại:</Text>
                <Text style={styles.confirmationValue}>
                  {user ? user.phone : "N/A"}
                </Text>
              </View>

              <View style={styles.confirmationItem}>
                <Text style={styles.confirmationLabel}>Email:</Text>
                <Text style={styles.confirmationValue}>
                  {user ? user.email : "N/A"}
                </Text>
              </View>

              <View style={styles.datePickerContainer}>
                <Text style={styles.datePickerLabel}>Chọn ngày:</Text>
                <TextInput
                  style={styles.datePickerInput}
                  value={selectedDate}
                  editable={false}
                />
                <View style={styles.dateButtonsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      dayjs(selectedDate).isSameOrBefore(currentDate, "day") &&
                        styles.disabledDateButton,
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
                  >
                    <Text style={styles.dateButtonText}>Hôm trước</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => {
                      setSelectedDate(
                        dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD")
                      );
                    }}
                  >
                    <Text style={styles.dateButtonText}>Hôm sau</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <LinearGradient
                colors={["#4CAF50", "#388E3C"]}
                style={styles.confirmButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.confirmButtonText}>Xác nhận đặt lịch</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: "center",
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#3674B5",
    marginBottom: 6,
    fontWeight: "500",
  },
  starsContainer: {
    flexDirection: "row",
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#F0F0F0",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  specialtiesList: {
    marginTop: 8,
  },
  specialtyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  specialtyText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  durationText: {
    color: "#FF7043",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  dateSelector: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F0FB",
    padding: 12,
    borderRadius: 8,
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  timeSlotLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  timeSlot: {
    backgroundColor: "#E8F0FB",
    borderRadius: 8,
    padding: 12,
    margin: 4,
    width: (width - 32 - 32 - 8) / 3, // (screen width - horizontal margins - padding - gaps) / 3 items
    alignItems: "center",
  },
  selectedTimeSlot: {
    backgroundColor: "#3674B5",
  },
  timeSlotText: {
    fontSize: 12,
    color: "#3674B5",
    fontWeight: "500",
  },
  selectedTimeSlotText: {
    color: "#fff",
  },
  noSlotsText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    padding: 12,
    textAlign: "center",
    width: "100%",
  },
  bottomBar: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  bookButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  bookButtonGradient: {
    padding: 16,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    marginBottom: 20,
  },
  confirmationItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  confirmationLabel: {
    width: 100,
    fontSize: 14,
    color: "#666",
  },
  confirmationValue: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  datePickerContainer: {
    marginTop: 8,
  },
  datePickerLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  datePickerInput: {
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  dateButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateButton: {
    backgroundColor: "#3674B5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: "center",
  },
  disabledDateButton: {
    backgroundColor: "#B0BEC5",
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  confirmButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  confirmButtonGradient: {
    padding: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PsyDetail;
