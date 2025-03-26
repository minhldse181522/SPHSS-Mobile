import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Survey } from "../../models/survey";
import { useNavigation } from "@react-navigation/native";
import { getSurvey } from "../../service/api";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

function SurveyPage() {
  const [surveyList, setSurveyList] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  const fetchSurveys = async () => {
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSurveys();
  };

  const renderSurveyItem = ({ item }: { item: Survey }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("SurveyDetail", { surveyId: item.surveyId })
      }
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardIcon}>
          <MaterialIcons name="assignment" size={24} color="#3674B5" />
        </View>
        <View style={styles.cardTextContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.cardStat}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.cardStatText}>10-20 min</Text>
            </View>
            <View style={styles.cardStat}>
              <Ionicons name="help-circle-outline" size={16} color="#666" />
              <Text style={styles.cardStatText}>21 questions</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.cardAction}>
        <MaterialIcons name="chevron-right" size={24} color="#3674B5" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3674B5" barStyle="light-content" />
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3674B5" />
          <Text style={styles.loadingText}>Loading surveys...</Text>
        </View>
      ) : surveyList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="clipboard-list" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No surveys available</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchSurveys}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={surveyList}
          keyExtractor={(item) => item.surveyId}
          renderItem={renderSurveyItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3674B5"]}
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                Complete surveys to help us understand your mental health needs
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#3674B5",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  rightPlaceholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
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
  refreshButton: {
    backgroundColor: "#3674B5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
  },
  listHeader: {
    backgroundColor: "#E8F0FB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3674B5",
  },
  listHeaderText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F0FB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardStat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  cardStatText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  cardAction: {
    justifyContent: "center",
    paddingLeft: 8,
  },
});

export default SurveyPage;
