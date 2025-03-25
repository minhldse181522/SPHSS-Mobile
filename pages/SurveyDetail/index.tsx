import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ProgressBar } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { RadioButton } from "react-native-paper";
import { NavigationProps } from "../Program";
import {
  getSurveyResultById,
  getSurveysAnswerAndQuestion,
  submitSurvey,
} from "../../service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

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

  const handleSubmitSurvey = async () => {
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
      surveyId: 68,
      answers: answersArray,
    };

    console.log(result);

    try {
      const response = await submitSurvey(result);
      console.log(response.data.data.surveyResultId);

      if (response?.data?.data.surveyResultId) {
        console.log(response.data.data.surveyResultId);
        fetchSurveyResult(response.data.data.surveyResultId);
      } else {
        Alert.alert(
          "Error",
          "API did not return surveyResultId. Check the API!"
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit survey.");
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
    } catch (error) {
      Alert.alert("Error", "Failed to fetch survey result.");
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
        const response = await getSurveysAnswerAndQuestion(surveyId);
        if (response.data && response.data.data) {
          setQuestions(response.data.data);
        } else {
          console.log("No data in response:", response);
          setQuestions([]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [surveyId]);

  useEffect(() => {
    fetchSurveyDetail();
  }, []);

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
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

  if (showResult) {
    return (
      <ScrollView contentContainerStyle={styles.resultContainer}>
        <Text style={styles.resultTitle}>Kết quả khảo sát</Text>
        <Text style={styles.resultScore}>Điểm của bạn: {finalScore}</Text>
        <Text style={styles.resultInterpretation}>
          {getResultInterpretation(finalScore)}
        </Text>
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
            backgroundColor: "#f5f5f5",
            backgroundGradientFrom: "#f5f5f5",
            backgroundGradientTo: "#f5f5f5",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate("Survey")}
        >
          <Text style={styles.buttonText}>Quay lại danh sách khảo sát</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (!questions.length) {
    return <Text style={styles.noSurveyText}>Không tìm thấy bài khảo sát</Text>;
  }

  const progress = (currentQuestion / questions.length) * 100;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProgressBar
        progress={progress / 100}
        color="#4caf50"
        style={styles.progressBar}
      />
      <View style={styles.questionCard}>
        <Text style={styles.questionNumber}>
          Câu hỏi {currentQuestion + 1}/{questions.length}
        </Text>
        <Text style={styles.questionText}>
          {questions[currentQuestion]?.questionText}
        </Text>
        <RadioButton.Group
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
        >
          {questions[currentQuestion].options.map((option: any) => (
            <RadioButton.Item
              key={option.optionId}
              label={option.optionText}
              value={option.optionId}
            />
          ))}
        </RadioButton.Group>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleNext}
          disabled={!answers[currentQuestion]}
        >
          <Text style={styles.buttonText}>
            {currentQuestion === questions.length - 1
              ? "Hoàn thành"
              : "Tiếp theo"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  progressBar: {
    height: 10,
    marginBottom: 20,
  },
  questionCard: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonPrimary: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonSecondary: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultContainer: {
    padding: 20,
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  resultScore: {
    fontSize: 20,
    marginBottom: 10,
  },
  resultInterpretation: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  chart: {
    marginVertical: 20,
  },
  noSurveyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
  },
});

export default SurveyDetail;
