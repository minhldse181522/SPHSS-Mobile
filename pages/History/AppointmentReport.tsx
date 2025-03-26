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
      const response = await api.get<{ data: Report[] }>(
        "https://ssphis.onrender.com/api/reports"
      );
      const foundReport = response.data.data.find(
        (r) => r.appointment_id === appointmentId
      );
      setReport(foundReport || null);
    } catch (error) {
      console.error("Error fetching report details:", error);
    } finally {
      setLoading(false);
    }
  };

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
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Báo cáo buổi tư vấn</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.reportCard}>
          <Text style={styles.reportTitle}>BÁO CÁO CHI TIẾT BUỔI TƯ VẤN</Text>

          <View style={styles.reportRow}>
            <View style={styles.reportColumn}>
              <Text style={styles.reportLabel}>NGÀY TƯ VẤN</Text>
              <Text style={styles.reportValue}>
                {formatDate(report.appointment_date)}
              </Text>
            </View>
            <View style={styles.reportColumn}>
              <Text style={styles.reportLabel}>THỜI GIAN</Text>
              <Text style={styles.reportValue}>
                {report.start_time} - {report.end_time}
              </Text>
            </View>
            <View style={styles.reportColumn}>
              <Text style={styles.reportLabel}>TRẠNG THÁI</Text>
              <Text style={[styles.reportValue, { color: "#28A745" }]}>
                {report.appointment_status}
              </Text>
            </View>
          </View>

          <View style={styles.reportRow}>
            <View style={styles.reportColumn}>
              <Text style={styles.reportLabel}>CHUYÊN VIÊN TƯ VẤN</Text>
              <Text style={styles.reportValue}>{report.full_name_pys}</Text>
            </View>
            <View style={styles.reportColumn}>
              <Text style={styles.reportLabel}>EMAIL</Text>
              <Text style={styles.reportValue}>{report.pys_email}</Text>
            </View>
            <View style={styles.reportColumn}>
              <Text style={styles.reportLabel}>ĐIỆN THOẠI</Text>
              <Text style={styles.reportValue}>{report.pys_phone}</Text>
            </View>
          </View>

          <View style={styles.reportSection}>
            <Text style={styles.reportSectionTitle}>HỌ VÀ TÊN SINH VIÊN</Text>
            <Text style={styles.reportSectionValue}>{report.full_name}</Text>
          </View>

          <View style={styles.reportSection}>
            <Text style={styles.reportSectionTitle}>MSSV</Text>
            <Text style={styles.reportSectionValue}>{report.student_id}</Text>
          </View>

          <View style={styles.reportSection}>
            <Text style={styles.reportSectionTitle}>Thông tin cá nhân</Text>
            <Text style={styles.reportSectionValue}>
              Email: {report.user_email}
            </Text>
            <Text style={styles.reportSectionValue}>
              Phone: {report.user_phone}
            </Text>
          </View>

          <View style={styles.reportSection}>
            <Text style={styles.reportSectionTitle}>MỨC ĐỘ SỨC KHỎE</Text>
            <Text style={styles.reportSectionValue}>{report.health_level}</Text>
          </View>

          <View style={styles.reportSection}>
            <Text style={styles.reportSectionTitle}>Tình trạng sức khỏe</Text>
            <Text style={styles.reportSectionValue}>
              {report.health_status}
            </Text>
          </View>

          <View style={styles.reportSection}>
            <Text style={styles.reportSectionTitle}>ĐÁNH GIÁ</Text>
            <Text style={styles.reportSectionValue}>{report.feedback}</Text>
          </View>

          <View style={styles.reportSection}>
            <Text style={styles.reportSectionTitle}>GHI CHÚ</Text>
            <Text style={styles.reportSectionValue}>
              {report.recommendations}
            </Text>
          </View>

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
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    padding: 16,
  },
  reportCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28A745",
    textAlign: "center",
    marginBottom: 16,
  },
  reportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  reportColumn: {
    flex: 1,
    alignItems: "center",
  },
  reportLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  reportValue: {
    fontSize: 14,
    color: "#666",
  },
  reportSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  reportSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  reportSectionValue: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  reportFooter: {
    marginTop: 16,
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
