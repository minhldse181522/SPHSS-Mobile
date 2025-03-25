import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Survey } from "../../models/survey";
import { useNavigation } from "@react-navigation/native";
import { getSurvey } from "../../service/api";
import { NavigationProps } from "../../pages/Program";

function SurveyPage() {
  const [surveyList, setSurveyList] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    (async () => {
      try {
        const response = await getSurvey();
        if (response.data && response.data.data) {
          setSurveyList(response.data.data);
        } else {
          console.log("No data in response:", response);
          setSurveyList([]);
        }
      } catch (error: any) {
        console.error("Error fetching surveys:", error);
        if (error.response) {
          console.error("Error response:", error.response);
        }
        setSurveyList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={surveyList}
        keyExtractor={(item) => item.surveyId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("SurveyDetail", { surveyId: item.surveyId })
            }
          >
            <Text style={styles.title}>{item.title}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text>⏱ 10-20 phút</Text>
              <Text>❓ 21 câu hỏi</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

export default SurveyPage;
