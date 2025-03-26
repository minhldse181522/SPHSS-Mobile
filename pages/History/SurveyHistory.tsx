import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
  ActivityIndicator,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../config/axios";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  SurveyDetail: { surveyId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
  surveyResultId: string;
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
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchSurveyData = async (): Promise<void> => {
      setIsLoading(true);
      const storeUser = await AsyncStorage.getItem("userData");
      const user: User = JSON.parse(storeUser || "{}");
      try {
        const response = await api.get<{ data: SurveyResult[] }>(
          `https://ssphis.onrender.com/api/survey-result/user/${user.id}`
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, []);

  const openModal = (survey: SurveyResult): void => {
    setSelectedSurvey(survey);
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = (): void => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 300,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedSurvey(null);
    });
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
  console.log("data", data);

  const renderItem = ({ item }: { item: SurveyResult }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openModal(item)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={["#ffffff", "#f8f9fa"]}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.programName}>{item.survey.title}</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{item.createdAt}</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Tổng điểm</Text>
            <Text style={styles.scoreValue}>
              {(item.depressionScore || 0) +
                (item.anxietyScore || 0) +
                (item.stressScore || 0)}
            </Text>
          </View>
        </View>
      </LinearGradient>
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
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8C00" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.surveyResultId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <LinearGradient
                colors={["#FF8C00", "#FFA500"]}
                style={styles.modalHeader}
              >
                <Text style={styles.modalTitle}>
                  {selectedSurvey?.survey.title}
                </Text>
              </LinearGradient>

              <View style={styles.modalBody}>
                <Text style={styles.sectionTitle}>Kết quả khảo sát</Text>
                <View style={styles.totalScoreContainer}>
                  <Text style={styles.score}>{totalScore}</Text>
                  <Text style={styles.scoreLabel}>Điểm của bạn</Text>
                </View>

                <Text style={styles.sectionTitle}>Chi tiết kết quả</Text>
                <View style={styles.chartContainer}>
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
                      labelColor: (opacity = 1) =>
                        `rgba(51, 51, 51, ${opacity})`,
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
                </View>

                <View style={styles.recommendationBox}>
                  <Text style={styles.recommendationTitle}>Lời khuyên</Text>
                  <Text style={styles.recommendationText}>
                    {getResultInterpretation(totalScore)}
                  </Text>
                </View>

                <Text style={styles.sectionTitle}>Tình trạng sức khỏe</Text>
                <View style={styles.healthStatusContainer}>
                  <View style={styles.legendRow}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: "#FF8C00" },
                      ]}
                    />
                    <Text style={styles.legendText}>Trầm cảm</Text>
                    <Text style={styles.legendValue}>
                      {selectedSurvey?.depressionLevel}
                    </Text>
                  </View>
                  <View style={styles.legendRow}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: "#28A745" },
                      ]}
                    />
                    <Text style={styles.legendText}>Lo âu</Text>
                    <Text style={styles.legendValue}>
                      {selectedSurvey?.anxietyLevel}
                    </Text>
                  </View>
                  <View style={styles.legendRow}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: "#007AFF" },
                      ]}
                    />
                    <Text style={styles.legendText}>Stress</Text>
                    <Text style={styles.legendValue}>
                      {selectedSurvey?.stressLevel}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerGradient: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  programName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  dateContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreContainer: {
    backgroundColor: "#e8f5e9",
    padding: 8,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#2e7d32",
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    position: "relative",
    overflow: "hidden",
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
  modalHeader: {
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  modalBody: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  totalScoreContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  score: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FF8C00",
    marginBottom: 4,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationBox: {
    backgroundColor: "#E6F0FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  healthStatusContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 12,
  },
  legendText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  legendValue: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});

export default SurveyHistory;
