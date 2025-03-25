import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../config/axios";

const screenWidth = Dimensions.get("window").width;

// Define interfaces
interface User {
  id: string;
  [key: string]: any;
}

interface Survey {
  title: string;
}

interface SurveyResult {
  id: string;
  survey: Survey;
  createdAt: string;
  depressionScore?: number;
  anxietyScore?: number;
  stressScore?: number;
  depressionLevel?: string;
  anxietyLevel?: string;
  stressLevel?: string;
}

const SurveyHistory: React.FC = () => {
  const [data, setData] = useState<SurveyResult[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyResult | null>(null);

  useEffect(() => {
    const fetchSurveyData = async (): Promise<void> => {
      const storeUser = await AsyncStorage.getItem("userData");
      const user: User = JSON.parse(storeUser || "{}");
      try {
        const response = await api.get<SurveyResult[]>(
          `https://ssphis.onrender.com/api/survey-result/user/${user.id}`
        );
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching survey data:', error);
      }
    };

    fetchSurveyData();
  }, []);

  const openModal = (survey: SurveyResult): void => {
    setSelectedSurvey(survey);
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
    setSelectedSurvey(null);
  };

  const getResultInterpretation = (score: number): string => {
    if (score >= 0 && score <= 9) {
      return "Kết quả cho thấy bạn đang có dấu hiệu của vấn đề tâm lý ở mức độ bình thường. Tiếp tục duy trì lối sống lành mạnh và cân bằng.";
    } else if (score >= 10 && score <= 13) {
      return "Bạn đang có một số dấu hiệu của vấn đề tâm lý ở mức độ nhẹ. Nên theo dõi và chú ý đến sức khỏe tinh thần của mình.";
    } else if (score >= 14 && score <= 20) {
      return "Bạn đang có một số dấu hiệu của vấn đề tâm lý ở mức độ trung bình. Bạn nên tìm đến chuyên gia tâm lý để được tư vấn.";
    } else if (score >= 21 && score <= 27) {
      return "Bạn đang có một số dấu hiệu của vấn đề tâm lý ở mức độ cao. Bạn nên tìm đến chuyên gia tâm lý càng sớm càng tốt.";
    }
    return "Kết quả của bạn ở mức báo động. Bạn cần tìm đến chuyên gia tâm lý ngay lập tức!";
  };

  const renderItem = ({ item }: { item: SurveyResult }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.programName}>{item.survey.title}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardText}>
          <Text style={styles.label}>Ngày: </Text>
          {item.createdAt}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const chartData = {
    labels: ["Trầm cảm", "Lo âu", "Căng thẳng"],
    datasets: [
      {
        data: [
          selectedSurvey?.depressionScore || 0,
          selectedSurvey?.anxietyScore || 0,
          selectedSurvey?.stressScore || 0,
        ],
      },
    ],
  };

  const totalScore: number = selectedSurvey
    ? (selectedSurvey.depressionScore || 0) +
    (selectedSurvey.anxietyScore || 0) +
    (selectedSurvey.stressScore || 0)
    : 0;

  return (
    <>
      <Text style={styles.title}>Lịch sử khảo sát</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedSurvey?.survey.title}</Text>

              <Text style={styles.sectionTitle}>Kết quả khảo sát</Text>
              <Text style={styles.score}>{totalScore}</Text>
              <Text style={styles.scoreLabel}>Điểm của bạn</Text>

              <Text style={styles.sectionTitle}>Chi tiết kết quả</Text>
              <BarChart
                data={chartData}
                width={screenWidth - 80}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "0",
                    strokeWidth: "0",
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                fromZero={true}
                showValuesOnTopOfBars={true}
              />

              <View style={styles.recommendationBox}>
                <Text style={styles.recommendationTitle}>Lời khuyên</Text>
                <Text style={styles.recommendationText}>
                  {getResultInterpretation(totalScore)}
                </Text>
              </View>

              <Text style={styles.sectionTitle}>Tình trạng sức khỏe</Text>
              <View style={styles.legendRow}>
                <View style={[styles.legendColor, { backgroundColor: "#FF8C00" }]} />
                <Text style={styles.legendText}>Trầm cảm</Text>
                <Text style={styles.legendValue}>{selectedSurvey?.depressionLevel}</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendColor, { backgroundColor: "#28A745" }]} />
                <Text style={styles.legendText}>Lo âu</Text>
                <Text style={styles.legendValue}>{selectedSurvey?.anxietyLevel}</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendColor, { backgroundColor: "#007AFF" }]} />
                <Text style={styles.legendText}>Stress</Text>
                <Text style={styles.legendValue}>{selectedSurvey?.stressLevel}</Text>
              </View>
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
    marginBottom: 8,
  },
  programName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardBody: {
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: "#666",
  },
  label: {
    fontWeight: "600",
    color: "#333",
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
    color: "#FF8C00",
    textAlign: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  score: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  recommendationBox: {
    backgroundColor: "#E6F0FA",
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: "#666",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  legendValue: {
    fontSize: 14,
    color: "#666",
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

export default SurveyHistory;