import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../config/axios";

// Define interfaces for your data structures
interface User {
  id: string;
  [key: string]: any;
}

interface Appointment {
  appointment_id: string;
  firstNamePys: string;
  lastNamePys: string;
  status: string;
  date: string;
  start_time: string;
  end_time: string;
  linkMeeting?: string;
}

interface Report {
  report_id: string;
  appointment_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  appointment_status: string;
  full_name_pys: string;
  pys_email: string;
  pys_phone: string;
  full_name: string;
  student_id: string;
  user_email: string;
  user_phone: string;
  health_level: string;
  health_status: string;
  feedback: string;
  recommendations: string;
  createdAt: string;
}

const AppointmentSchedule: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async (): Promise<void> => {
    try {
      const storeUser = await AsyncStorage.getItem("userData");
      const user: User = JSON.parse(storeUser || "{}");
      const response = await api.get<Appointment[]>( // Changed type to Appointment[]
        `https://ssphis.onrender.com/api/appointmentsByUser?user_id=${user.id}`
      );
      setAppointments(response.data); // Just response.data
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportDetails = async (appointmentId: string): Promise<void> => {
    try {
      const response = await api.get<{ data: Report[] }>(
        "https://ssphis.onrender.com/api/reports"
      );
      const report = response.data.data.find((r) => r.appointment_id === appointmentId);
      setSelectedReport(report || null);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching report details:", error);
    }
  };

  const openModal = (appointment: Appointment): void => {
    fetchReportDetails(appointment.appointment_id);
  };

  const closeModal = (): void => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const renderItem = ({ item }: { item: Appointment }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.doctorName}>
          {item.firstNamePys} {item.lastNamePys}
        </Text>
        <Text
          style={[
            styles.status,
            {
              color:
                item.status === "Completed"
                  ? "#28A745"
                  : item.status === "Approved"
                    ? "#007AFF"
                    : "#FFC107",
            },
          ]}
        >
          {item.status}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardText}>
          <Text style={styles.label}>Ngày tư vấn: </Text>
          {formatDate(item.date)}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.label}>Thời gian: </Text>
          {item.start_time} - {item.end_time}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.label}>Link: </Text>
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (item.linkMeeting) {
              Linking.openURL(item.linkMeeting);
            }
          }}
        >
          <Text style={[styles.cardText, { color: "blue", textDecorationLine: "underline" }]}>
            {item.linkMeeting || "N/A"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => openModal(item)}
      >
        <Text style={styles.detailButtonText}>Xem chi tiết</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  console.log(selectedReport);

  return (
    <>
      <Text style={styles.title}>Lịch hẹn khám</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={(item) => item.appointment_id}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>BÁO CÁO CHI TIẾT BUỔI TƯ VẤN</Text>

              {selectedReport ? (
                <>
                  <View style={styles.modalRow}>
                    <View style={styles.modalColumn}>
                      <Text style={styles.modalLabel}>NGÀY TƯ VẤN</Text>
                      <Text style={styles.modalValue}>
                        {formatDate(selectedReport.appointment_date)}
                      </Text>
                    </View>
                    <View style={styles.modalColumn}>
                      <Text style={styles.modalLabel}>THỜI GIAN</Text>
                      <Text style={styles.modalValue}>
                        {selectedReport.start_time} - {selectedReport.end_time}
                      </Text>
                    </View>
                    <View style={styles.modalColumn}>
                      <Text style={styles.modalLabel}>TRẠNG THÁI</Text>
                      <Text style={[styles.modalValue, { color: "#28A745" }]}>
                        {selectedReport.appointment_status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalRow}>
                    <View style={styles.modalColumn}>
                      <Text style={styles.modalLabel}>CHUYÊN VIÊN TƯ VẤN</Text>
                      <Text style={styles.modalValue}>
                        {selectedReport.full_name_pys}
                      </Text>
                    </View>
                    <View style={styles.modalColumn}>
                      <Text style={styles.modalLabel}>EMAIL</Text>
                      <Text style={styles.modalValue}>
                        {selectedReport.pys_email}
                      </Text>
                    </View>
                    <View style={styles.modalColumn}>
                      <Text style={styles.modalLabel}>ĐIỆN THOẠI</Text>
                      <Text style={styles.modalValue}>
                        {selectedReport.pys_phone}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                      HỌ VÀ TÊN SINH VIÊN
                    </Text>
                    <Text style={styles.modalSectionValue}>
                      {selectedReport.full_name}
                    </Text>
                  </View>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>MSSV</Text>
                    <Text style={styles.modalSectionValue}>
                      {selectedReport.student_id}
                    </Text>
                  </View>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Thông tin cá nhân</Text>
                    <Text style={styles.modalSectionValue}>
                      Email: {selectedReport.user_email}
                    </Text>
                    <Text style={styles.modalSectionValue}>
                      Phone: {selectedReport.user_phone}
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>MỨC ĐỘ SỨC KHỎE</Text>
                    <Text style={styles.modalSectionValue}>
                      {selectedReport.health_level}
                    </Text>
                  </View>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Tình trạng sức khỏe</Text>
                    <Text style={styles.modalSectionValue}>
                      {selectedReport.health_status}
                    </Text>
                  </View>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>ĐÁNH GIÁ</Text>
                    <Text style={styles.modalSectionValue}>
                      {selectedReport.feedback}
                    </Text>
                  </View>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>GHI CHÚ</Text>
                    <Text style={styles.modalSectionValue}>
                      {selectedReport.recommendations}
                    </Text>
                  </View>

                  <View style={styles.modalFooter}>
                    <Text style={styles.modalFooterText}>
                      Mã báo cáo: {selectedReport.report_id}
                    </Text>
                    <Text style={styles.modalFooterText}>
                      Ngày tạo: {formatDate(selectedReport.createdAt)}
                    </Text>
                    <Text style={styles.modalFooterText}>
                      Người tạo: {selectedReport.full_name_pys}
                    </Text>
                  </View>
                </>
              ) : (
                <View>
                  <Text style={styles.modalTitle}>Không có chi tiết</Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Styles remain unchanged
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardBody: {
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  label: {
    fontWeight: "600",
    color: "#333",
  },
  detailButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    position: "relative",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28A745",
    textAlign: "center",
    marginBottom: 16,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  modalColumn: {
    flex: 1,
    alignItems: "center",
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 14,
    color: "#666",
  },
  modalSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  modalSectionValue: {
    fontSize: 14,
    color: "#666",
  },
  modalFooter: {
    marginTop: 16,
  },
  modalFooterText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ddd",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default AppointmentSchedule;