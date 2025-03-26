import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { formatDate, formatTime } from "../../utils/dateUtils";
import Toast from "react-native-toast-message";
import { cancelAppointment, getAppointmentSchedule } from "../../service/api";
import { Appointmentt } from "../../models/appointment";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HistoryTabParamList } from "../../utils/routes";

type NavigationProp = NativeStackNavigationProp<
  HistoryTabParamList,
  "AppointmentSchedule"
>;

const AppointmentScheduleComponent = () => {
  const [appointments, setAppointments] = useState<Appointmentt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(user!);
      const response = await getAppointmentSchedule(userData.id);

      if (response.status === 200 && response.data && response.data.data) {
        setAppointments(response.data.data);
      } else {
        console.error("Invalid response format:", response);
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments: ", error);
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log("a", appointments);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    Alert.alert(
      "Xác nhận hủy lịch hẹn",
      "Bạn có chắc chắn muốn hủy lịch hẹn này không?",
      [
        {
          text: "Không",
          style: "cancel",
        },
        {
          text: "Có, hủy lịch",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await cancelAppointment(appointmentId);

              if (response.status === 200) {
                Toast.show({
                  type: "success",
                  text1: "Hủy lịch hẹn thành công!",
                });
                fetchData();
              } else {
                Toast.show({
                  type: "error",
                  text1: "Không thể hủy lịch hẹn",
                  text2: "Vui lòng thử lại sau.",
                });
              }
            } catch (error) {
              console.error("Error cancelling appointment:", error);
              Toast.show({
                type: "error",
                text1: "Không thể hủy lịch hẹn",
                text2: "Đã xảy ra lỗi, vui lòng thử lại sau.",
              });
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#FF9800";
      case "Approved":
        return "#4CAF50";
      case "Completed":
        return "#673AB7";
      case "Cancelled":
        return "#F44336";
      default:
        return "#FF9800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return "time";
      case "Approved":
        return "checkmark-circle";
      case "Completed":
        return "checkmark-done-circle";
      case "Cancelled":
        return "close-circle";
      default:
        return "time";
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="calendar-alt" size={70} color="#DDD" />
      <Text style={styles.emptyText}>Bạn chưa có lịch hẹn nào</Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate("Psychologist" as never)}
      >
        <LinearGradient
          colors={["#3674B5", "#2A5A8E"]}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.buttonText}>Đặt lịch ngay</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderAppointmentItem = ({ item }: { item: Appointmentt }) => {
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);
    const isExpanded = expandedId === item.appointment_id;
    const canCancel = item.status === "Pending";
    const isCompleted = item.status === "Completed";

    return (
      <View style={styles.appointmentCard}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleExpand(item.appointment_id)}
          activeOpacity={0.7}
        >
          <View style={styles.doctorContainer}>
            <Image
              // source={{ uri: item.psychologist.avatar }}
              style={styles.doctorImage}
              defaultSource={require("../../assets/Psychologist.png")}
            />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>BS. {item.firstNamePys}</Text>
              <Text style={styles.doctorSpecialty}>{"Chuyên gia tâm lý"}</Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + "20", borderColor: statusColor },
            ]}
          >
            <Ionicons name={statusIcon} size={14} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.appointmentInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{formatDate(item.date)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                {item.start_time} - {item.end_time}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialIcons name="meeting-room" size={16} color="#666" />
              <Text style={styles.infoText}>Trực tuyến</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="attach-money" size={16} color="#666" />
              <Text style={styles.infoText}>300.000 VND</Text>
            </View>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />

            {/* {item.note && ( */}
            <View style={styles.noteContainer}>
              <Text style={styles.noteLabel}>Ghi chú:</Text>
              <Text style={styles.noteText}>Bệnh nhiều quá trời</Text>
            </View>
            {/* )} */}

            <View style={styles.contactContainer}>
              <Text style={styles.contactLabel}>Thông tin liên hệ:</Text>
              <View style={styles.contactItem}>
                <Ionicons name="call-outline" size={14} color="#666" />
                <Text style={styles.contactText}>0123456789</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={14} color="#666" />
                <Text style={styles.contactText}>test@gmail.com</Text>
              </View>
              {/* {item.appointmentType === "ONSITE" && item.location && ( */}
              <View style={styles.contactItem}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.contactText}>ONSITE</Text>
              </View>
              {/* )} */}
              {item.linkMeeting && (
                <View style={styles.contactItem}>
                  <Ionicons name="videocam-outline" size={14} color="#666" />
                  <Text style={styles.contactText}>{item.linkMeeting}</Text>
                </View>
              )}
            </View>

            <View style={styles.actionButtonsContainer}>
              {canCancel && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelAppointment(item.appointment_id)}
                >
                  <Text style={styles.cancelButtonText}>Hủy lịch hẹn</Text>
                </TouchableOpacity>
              )}

              {isCompleted && (
                <TouchableOpacity
                  style={styles.reportButton}
                  onPress={() =>
                    navigation.navigate("AppointmentReport", {
                      appointmentId: item.appointment_id,
                    })
                  }
                >
                  <Text style={styles.reportButtonText}>Xem báo cáo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => toggleExpand(item.appointment_id)}
        >
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color="#3674B5"
          />
          <Text style={styles.expandButtonText}>
            {isExpanded ? "Thu gọn" : "Xem chi tiết"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3674B5" />
        <Text style={styles.loadingText}>Đang tải lịch hẹn...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.appointment_id}
        renderItem={renderAppointmentItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3674B5"]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  appointmentCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  doctorContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: "#666",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  appointmentInfo: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  expandedContent: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 12,
  },
  noteContainer: {
    marginBottom: 16,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  contactContainer: {
    marginBottom: 16,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  contactText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: "#FEE2E2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
  },
  reportButton: {
    backgroundColor: "#E0F2F1",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    flex: 1,
  },
  reportButtonText: {
    color: "#00897B",
    fontSize: 14,
    fontWeight: "600",
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  expandButtonText: {
    fontSize: 14,
    color: "#3674B5",
    marginLeft: 4,
  },
});

export default AppointmentScheduleComponent;
