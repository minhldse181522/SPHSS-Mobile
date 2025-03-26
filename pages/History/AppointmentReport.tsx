import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import api from "../../config/axios";
import { Ionicons } from "@expo/vector-icons";
import { getReports } from "../../service/api";

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

type AppointmentReportRouteParams = {
  appointmentId: string;
};

type AppointmentReportRouteProp = RouteProp<
  { AppointmentReport: AppointmentReportRouteParams },
  "AppointmentReport"
>;

const AppointmentReport: React.FC = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const route = useRoute<AppointmentReportRouteProp>();
  const navigation = useNavigation();
  const { appointmentId } = route.params;

  useEffect(() => {
    fetchReportDetails();
  }, [appointmentId]);

  const fetchReportDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await getReports();
      console.log("response", response.data.data[0].appointment_id);

      const foundReport = response.data.data.find(
        (r: any) => r.appointment_id === parseInt(appointmentId, 10)
      );
      console.log("foundReport", foundReport);

      setReport(foundReport || null);
    } catch (error) {
      console.error("Error fetching report details:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log({ report });
  console.log({ appointmentId });

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3674B5" />
        <Text style={styles.loadingText}>Đang tải báo cáo...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Báo cáo buổi tư vấn</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={80} color="#DDD" />
          <Text style={styles.emptyText}>
            Không tìm thấy báo cáo cho buổi tư vấn này
          </Text>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.goBackButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#3674B5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Báo cáo buổi tư vấn</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.reportCard}>
          <View style={styles.reportHeaderBanner}>
            <Text style={styles.reportTitle}>BÁO CÁO CHI TIẾT BUỔI TƯ VẤN</Text>
          </View>

          <View style={styles.reportRow}>
            <View style={styles.reportColumn}>
              <View style={styles.iconLabelContainer}>
                <Ionicons name="calendar-outline" size={18} color="#3674B5" />
                <Text style={styles.reportLabel}>NGÀY TƯ VẤN</Text>
              </View>
              <Text style={styles.reportValue}>
                {formatDate(report.appointment_date)}
              </Text>
            </View>
            <View style={styles.reportColumn}>
              <View style={styles.iconLabelContainer}>
                <Ionicons name="time-outline" size={18} color="#3674B5" />
                <Text style={styles.reportLabel}>THỜI GIAN</Text>
              </View>
              <Text style={styles.reportValue}>
                {report.start_time} - {report.end_time}
              </Text>
            </View>
            <View style={styles.reportColumn}>
              <View style={styles.iconLabelContainer}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#3674B5"
                />
                <Text style={styles.reportLabel}>TRẠNG THÁI</Text>
              </View>
              <Text style={[styles.reportValue, { color: "#28A745" }]}>
                {report.appointment_status}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.reportRow}>
            <View style={styles.reportColumn}>
              <View style={styles.iconLabelContainer}>
                <Ionicons name="person-outline" size={18} color="#3674B5" />
                <Text style={styles.reportLabel}>CHUYÊN VIÊN</Text>
              </View>
              <Text style={styles.reportValue}>{report.full_name_pys}</Text>
            </View>
            <View style={styles.reportColumn}>
              <View style={styles.iconLabelContainer}>
                <Ionicons name="mail-outline" size={18} color="#3674B5" />
                <Text style={styles.reportLabel}>EMAIL</Text>
              </View>
              <Text style={styles.reportValue}>{report.pys_email}</Text>
            </View>
            <View style={styles.reportColumn}>
              <View style={styles.iconLabelContainer}>
                <Ionicons name="call-outline" size={18} color="#3674B5" />
                <Text style={styles.reportLabel}>ĐIỆN THOẠI</Text>
              </View>
              <Text style={styles.reportValue}>{report.pys_phone}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoSection}>
            <View style={styles.studentInfoHeader}>
              <Ionicons
                name="person-circle-outline"
                size={24}
                color="#3674B5"
              />
              <Text style={styles.studentInfoTitle}>THÔNG TIN SINH VIÊN</Text>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Họ và tên:</Text>
                <Text style={styles.infoValue}>{report.full_name}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>MSSV:</Text>
                <Text style={styles.infoValue}>{report.student_id}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{report.user_email}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>SĐT:</Text>
                <Text style={styles.infoValue}>{report.user_phone}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.healthSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="fitness-outline" size={24} color="#3674B5" />
              <Text style={styles.sectionTitle}>ĐÁNH GIÁ SỨC KHỎE</Text>
            </View>

            <View style={styles.healthLevelContainer}>
              <Text style={styles.healthLevelLabel}>Mức độ sức khỏe:</Text>
              <View
                style={[
                  styles.healthLevelBadge,
                  report.health_level === "Low"
                    ? styles.healthLevelLow
                    : report.health_level === "Medium"
                    ? styles.healthLevelMedium
                    : styles.healthLevelHigh,
                ]}
              >
                <Text style={styles.healthLevelText}>
                  {report.health_level}
                </Text>
              </View>
            </View>

            <View style={styles.reportContentBox}>
              <Text style={styles.contentBoxLabel}>Tình trạng sức khỏe:</Text>
              <Text style={styles.contentBoxValue}>{report.health_status}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#3674B5"
              />
              <Text style={styles.sectionTitle}>KẾT QUẢ ĐÁNH GIÁ</Text>
            </View>

            <View style={styles.reportContentBox}>
              <Text style={styles.contentBoxLabel}>Đánh giá chuyên môn:</Text>
              <Text style={styles.contentBoxValue}>{report.feedback}</Text>
            </View>

            <View style={styles.reportContentBox}>
              <Text style={styles.contentBoxLabel}>
                Khuyến nghị & lời khuyên:
              </Text>
              <Text style={styles.contentBoxValue}>
                {report.recommendations}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.reportFooter}>
            <Text style={styles.reportFooterText}>
              Mã báo cáo: {report.report_id}
            </Text>
            <Text style={styles.reportFooterText}>
              Ngày tạo: {formatDate(report.createdAt)}
            </Text>
            <Text style={styles.reportFooterText}>
              Người tạo: {report.full_name_pys}
            </Text>
          </View>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3674B5",
  },
  scrollView: {
    padding: 16,
  },
  reportCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  reportHeaderBanner: {
    backgroundColor: "#3674B5",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  reportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  reportColumn: {
    flex: 1,
    alignItems: "center",
  },
  iconLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  reportLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3674B5",
    marginLeft: 5,
  },
  reportValue: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 15,
    marginHorizontal: 20,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  studentInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  studentInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3674B5",
    marginLeft: 8,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -10,
  },
  infoItem: {
    width: "50%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  healthSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3674B5",
    marginLeft: 8,
  },
  healthLevelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  healthLevelLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  healthLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  healthLevelLow: {
    backgroundColor: "#ffcccc",
  },
  healthLevelMedium: {
    backgroundColor: "#fff2cc",
  },
  healthLevelHigh: {
    backgroundColor: "#d9f2d9",
  },
  healthLevelText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  reportContentBox: {
    backgroundColor: "#f7f9fc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  contentBoxLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3674B5",
    marginBottom: 8,
  },
  contentBoxValue: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  contentSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  reportFooter: {
    backgroundColor: "#f7f9fc",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  reportFooterText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 16,
  },
  goBackButton: {
    backgroundColor: "#3674B5",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  goBackButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AppointmentReport;
