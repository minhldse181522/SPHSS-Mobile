import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ProgressBar } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import { RadioButton } from "react-native-paper";
import {
  getSurveyResultById,
  getSurveysAnswerAndQuestion,
  submitSurvey,
} from "../../service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { NavigationProps } from "../Psy";

const { width } = Dimensions.get("window");
const screenWidth = width;

function SurveyDetail() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<any>();
  const { surveyId } = route.params;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [questions, setQuestions] = useState<any>([]);
  const [chartData, setChartData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const handleSubmitSurvey = async () => {
    try {
      setLoading(true);
      const answersArray = Object.entries(answers).map(
        ([questionIdx, optionId]) => {
          const question = questions[parseInt(questionIdx)];
          return {
            questionId: parseInt(question.questionId),
            optionId: optionId,
          };
        }
      );

      const userData = await AsyncStorage.getItem("userData");
      const parsedUser = JSON.parse(userData as string);

      const result = {
        userId: parseFloat(parsedUser.id),
        surveyId: parseInt(surveyId),
        answers: answersArray,
      };

      const response = await submitSurvey(result);

      if (response?.data?.data.surveyResultId) {
        fetchSurveyResult(response.data.data.surveyResultId);
      } else {
        Alert.alert(
          "Lỗi",
          "Không nhận được kết quả từ hệ thống. Vui lòng thử lại sau!"
        );
        setLoading(false);
      }
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Không thể hoàn thành khảo sát. Vui lòng thử lại sau!"
      );
      setLoading(false);
    }
  };

  const fetchSurveyResult = async (id: string) => {
    try {
      const response = await getSurveyResultById(id);
      const resultData = response.data.data;

      setFinalScore(
        Number(resultData.depressionScore) +
          Number(resultData.anxietyScore) +
          Number(resultData.stressScore)
      );
      const chartValues = generateChartData(resultData);
      setChartData(chartValues);

      setShowResult(true);
      setLoading(false);
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Không thể lấy kết quả khảo sát. Vui lòng thử lại sau!"
      );
      setLoading(false);
    }
  };

  const generateChartData = (resultData: any) => {
    return [
      { name: "Trầm cảm", strength: getStrength(resultData.depressionLevel) },
      { name: "Lo âu", strength: getStrength(resultData.anxietyLevel) },
      { name: "Căng thẳng", strength: getStrength(resultData.stressLevel) },
    ];
  };

  const fetchSurveyDetail = useCallback(async () => {
    if (surveyId) {
      try {
        setLoading(true);
        const response = await getSurveysAnswerAndQuestion(surveyId);
        if (response.data && response.data.data) {
          setQuestions(response.data.data);
        } else {
          console.log("No data in response:", response);
          setQuestions([]);
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Lỗi", "Không thể tải khảo sát. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    }
  }, [surveyId]);

  useEffect(() => {
    fetchSurveyDetail();
  }, [fetchSurveyDetail]);

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setLoading(true);
      handleSubmitSurvey();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getResultInterpretation = (score: any) => {
    if (score >= 0 && score <= 9) {
      return "Kết quả cho thấy bạn đang có dấu hiệu của vấn đề tâm lý ở mức độ bình thường.";
    } else if (score >= 10 && score <= 13) {
      return "Bạn đang có một số dấu hiệu của vấn đề tâm lý ở mức độ nhẹ.";
    } else if (score >= 14 && score <= 20) {
      return "Bạn đang có một số dấu hiệu của vấn đề tâm lý ở mức độ trung bình.";
    } else if (score >= 21 && score <= 27) {
      return "Bạn đang có một số dấu hiệu của vấn đề tâm lý ở mức độ cao.";
    }
    return "Kết quả của bạn ở mức báo động.";
  };

  const getStrength = (level: any) => {
    switch (level) {
      case "Normal":
        return 1;
      case "Mild":
        return 2;
      case "Moderate":
        return 3;
      case "Severe":
        return 4;
      case "Extremely Severe":
        return 5;
      default:
        return 0;
    }
  };

  const getLevelText = (level: any) => {
    switch (level) {
      case 1:
        return "Bình thường";
      case 2:
        return "Nhẹ";
      case 3:
        return "Trung bình";
      case 4:
        return "Nghiêm trọng";
      case 5:
        return "Rất nghiêm trọng";
      default:
        return "Không xác định";
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar backgroundColor="#3674B5" barStyle="light-content" />
        <ActivityIndicator size="large" color="#3674B5" />
        <Text style={styles.loadingText}>Đang tải khảo sát...</Text>
      </SafeAreaView>
    );
  }

  if (showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#3674B5" barStyle="light-content" />
        <LinearGradient colors={["#3674B5", "#2A5A8E"]} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Survey")}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kết quả khảo sát</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultContainer}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreTitle}>Điểm tổng kết</Text>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>{finalScore}</Text>
              </View>
              <View style={styles.resultBox}>
                <MaterialIcons name="info-outline" size={20} color="#3674B5" />
                <Text style={styles.resultInterpretation}>
                  {getResultInterpretation(finalScore)}
                </Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Phân tích chi tiết</Text>
              <BarChart
                data={{
                  labels: chartData.map((item: any) => item.name),
                  datasets: [
                    {
                      data: chartData.map((item: any) => item.strength),
                    },
                  ],
                }}
                width={screenWidth - 40}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(54, 116, 181, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={styles.chart}
                fromZero
                showValuesOnTopOfBars
              />

              <View style={styles.resultLegend}>
                {chartData.map((item: any, index: number) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        {
                          backgroundColor:
                            index === 0
                              ? "#FF6384"
                              : index === 1
                              ? "#36A2EB"
                              : "#4BC0C0",
                        },
                      ]}
                    />
                    <Text style={styles.legendText}>{item.name}: </Text>
                    <Text style={styles.legendValue}>
                      {getLevelText(item.strength)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationTitle}>Đề xuất</Text>
              <Text style={styles.recommendationText}>
                Nếu bạn đang gặp vấn đề về sức khỏe tinh thần, hãy tham khảo ý
                kiến của chuyên gia tâm lý. Ứng dụng của chúng tôi có thể giúp
                bạn kết nối với các chuyên gia tư vấn.
              </Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.psyButton}
                  onPress={() => navigation.navigate("Psy")}
                >
                  <LinearGradient
                    colors={["#3674B5", "#2A5A8E"]}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.buttonText}>Tìm chuyên gia tư vấn</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.programButton}
                  onPress={() => navigation.navigate("Survey")}
                >
                  <Text style={styles.programButtonText}>
                    Quay lại danh sách khảo sát
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!questions.length) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#3674B5" barStyle="light-content" />
        <LinearGradient colors={["#3674B5", "#2A5A8E"]} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Survey")}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Khảo sát</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        <View style={styles.emptyContainer}>
          <FontAwesome5 name="clipboard-list" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Không tìm thấy bài khảo sát</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate("Survey")}
          >
            <Text style={styles.emptyButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progress = (currentQuestion / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3674B5" barStyle="light-content" />
      <LinearGradient colors={["#3674B5", "#2A5A8E"]} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Survey")}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khảo sát</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <View style={styles.progressContainer}>
        <ProgressBar
          progress={progress / 100}
          color="#4CAF50"
          style={styles.progressBar}
        />
        <Text style={styles.progressText}>
          {currentQuestion + 1}/{questions.length}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.questionNumberBadge}>
              <Text style={styles.questionNumberText}>
                {currentQuestion + 1}
              </Text>
            </View>
            <Text style={styles.questionText}>
              {questions[currentQuestion]?.questionText}
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <RadioButton.Group
              onValueChange={handleAnswer}
              value={answers[currentQuestion]}
            >
              {questions[currentQuestion].options.map((option: any) => (
                <TouchableOpacity
                  key={option.optionId}
                  style={[
                    styles.optionItem,
                    answers[currentQuestion] === option.optionId &&
                      styles.selectedOption,
                  ]}
                  onPress={() => handleAnswer(option.optionId)}
                >
                  <RadioButton
                    value={option.optionId}
                    color="#3674B5"
                    uncheckedColor="#999"
                  />
                  <Text
                    style={[
                      styles.optionText,
                      answers[currentQuestion] === option.optionId &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {option.optionText}
                  </Text>
                </TouchableOpacity>
              ))}
            </RadioButton.Group>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.buttonSecondary,
            currentQuestion === 0 && styles.disabledButton,
          ]}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <Ionicons name="chevron-back" size={18} color="#3674B5" />
          <Text style={styles.buttonSecondaryText}>Quay lại</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonPrimary,
            !answers[currentQuestion] && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={!answers[currentQuestion]}
        >
          <Text style={styles.buttonPrimaryText}>
            {currentQuestion === questions.length - 1
              ? "Hoàn thành"
              : "Tiếp theo"}
          </Text>
          {currentQuestion < questions.length - 1 && (
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  progressContainer: {
    padding: 16,
    paddingBottom: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  progressText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#3674B5",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionHeader: {
    marginBottom: 20,
  },
  questionNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3674B5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  questionNumberText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  questionText: {
    fontSize: 18,
    color: "#333",
    lineHeight: 24,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  selectedOption: {
    backgroundColor: "#E8F0FB",
    borderWidth: 1,
    borderColor: "#3674B5",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginLeft: 8,
  },
  selectedOptionText: {
    color: "#3674B5",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  buttonPrimary: {
    backgroundColor: "#3674B5",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 8,
  },
  buttonPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
  buttonSecondary: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3674B5",
  },
  buttonSecondaryText: {
    color: "#3674B5",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#3674B5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    padding: 16,
  },
  scoreCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#3674B5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  resultBox: {
    backgroundColor: "#E8F0FB",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  resultInterpretation: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    marginLeft: 10,
    lineHeight: 20,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  chart: {
    marginVertical: 16,
    borderRadius: 8,
  },
  resultLegend: {
    marginTop: 8,
  },
  legendItem: {
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
    color: "#666",
  },
  legendValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  recommendationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  recommendationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButtons: {
    marginTop: 8,
  },
  psyButton: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  programButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3674B5",
  },
  programButtonText: {
    color: "#3674B5",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default SurveyDetail;
