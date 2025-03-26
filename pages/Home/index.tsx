import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Survey } from "../../models/survey";
import { getSurvey } from "../../service/api";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

function HomePage() {
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3674B5" barStyle="light-content" />

      {/* Header with Gradient */}
      <LinearGradient colors={["#3674B5", "#2A5A8E"]} style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Xin chào</Text>
          <Text style={styles.userName}>
            Bắt đầu hành trình sức khỏe tinh thần
          </Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={styles.profileIconContainer}>
            <Ionicons name="person" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3674B5"]}
          />
        }
      >
        {/* Quote of the day */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "Sức khỏe tinh thần không phải là đích đến, mà là một hành trình."
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Truy cập nhanh</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Program")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#FF7043" }]}>
                <MaterialIcons name="psychology" size={28} color="#fff" />
              </View>
              <Text style={styles.actionText}>Chương trình</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Survey")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#66BB6A" }]}>
                <MaterialIcons name="assignment" size={28} color="#fff" />
              </View>
              <Text style={styles.actionText}>Khảo sát</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("History")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#9575CD" }]}>
                <MaterialIcons name="history" size={28} color="#fff" />
              </View>
              <Text style={styles.actionText}>Lịch sử</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Chat")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#42A5F5" }]}>
                <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
              </View>
              <Text style={styles.actionText}>Trò chuyện</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Counselors Section */}
        <View style={styles.counselorsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chuyên gia tâm lý</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Psy")}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.counselorBanner}
            onPress={() => navigation.navigate("Psy")}
          >
            <LinearGradient
              colors={["rgba(54, 116, 181, 0.8)", "rgba(42, 90, 142, 0.9)"]}
              style={styles.counselorBannerGradient}
            >
              <View style={styles.counselorBannerContent}>
                <MaterialCommunityIcons name="brain" size={45} color="#fff" />
                <View style={styles.counselorBannerText}>
                  <Text style={styles.counselorBannerTitle}>Tư vấn tâm lý</Text>
                  <Text style={styles.counselorBannerSubtitle}>
                    Đội ngũ chuyên gia hàng đầu sẵn sàng hỗ trợ
                  </Text>
                </View>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recommended Surveys */}
        <View style={styles.surveyContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Khảo sát đề xuất</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Survey")}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3674B5" />
              <Text style={styles.loadingText}>Đang tải khảo sát...</Text>
            </View>
          ) : surveyList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="clipboard-list" size={50} color="#ccc" />
              <Text style={styles.emptyText}>Chưa có khảo sát nào</Text>
            </View>
          ) : (
            surveyList.slice(0, 3).map((survey) => (
              <TouchableOpacity
                key={survey.surveyId}
                style={styles.surveyCard}
                onPress={() =>
                  navigation.navigate("SurveyDetail", {
                    surveyId: survey.surveyId,
                  })
                }
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardIcon}>
                    <MaterialIcons
                      name="assignment"
                      size={24}
                      color="#3674B5"
                    />
                  </View>
                  <View style={styles.cardTextContent}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {survey.title}
                    </Text>
                    <Text style={styles.cardDescription} numberOfLines={2}>
                      {survey.description}
                    </Text>
                    <View style={styles.cardFooter}>
                      <View style={styles.cardStat}>
                        <Ionicons name="time-outline" size={16} color="#666" />
                        <Text style={styles.cardStatText}>10-20 phút</Text>
                      </View>
                      <View style={styles.cardStat}>
                        <Ionicons
                          name="help-circle-outline"
                          size={16}
                          color="#666"
                        />
                        <Text style={styles.cardStatText}>21 câu hỏi</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#3674B5" />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Mental Health Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Lời khuyên sức khỏe tinh thần</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tipsScrollView}
          >
            <LinearGradient
              colors={["#66BB6A", "#43A047"]}
              style={styles.tipCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons
                name="spa"
                size={28}
                color="#fff"
                style={styles.tipIcon}
              />
              <Text style={styles.tipTitle}>Quản lý căng thẳng</Text>
              <Text style={styles.tipDescription}>
                Hãy thực hiện các bài tập thở sâu trong 5 phút mỗi ngày để giảm
                căng thẳng và lo âu.
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={["#42A5F5", "#1E88E5"]}
              style={styles.tipCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons
                name="fitness-center"
                size={28}
                color="#fff"
                style={styles.tipIcon}
              />
              <Text style={styles.tipTitle}>Thói quen lành mạnh</Text>
              <Text style={styles.tipDescription}>
                Hoạt động thể chất thường xuyên có thể cải thiện tâm trạng và
                giảm cảm giác trầm cảm.
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={["#FF7043", "#E64A19"]}
              style={styles.tipCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons
                name="nightlight-round"
                size={28}
                color="#fff"
                style={styles.tipIcon}
              />
              <Text style={styles.tipTitle}>Giấc ngủ chất lượng</Text>
              <Text style={styles.tipDescription}>
                Ngủ đủ 7-8 tiếng mỗi đêm giúp cải thiện sức khỏe tinh thần và
                khả năng tập trung.
              </Text>
            </LinearGradient>
          </ScrollView>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    maxWidth: width * 0.7,
  },
  profileButton: {
    padding: 4,
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  quoteContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#E8F0FB",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3674B5",
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#2A5A8E",
    lineHeight: 24,
  },
  quickActionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    alignItems: "center",
    width: width / 4 - 15,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  counselorsContainer: {
    padding: 16,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: "#3674B5",
    fontWeight: "500",
  },
  counselorBanner: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
  },
  counselorBannerGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  counselorBannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  counselorBannerText: {
    marginLeft: 16,
    flex: 1,
  },
  counselorBannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  counselorBannerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    maxWidth: width * 0.55,
  },
  surveyContainer: {
    padding: 16,
    paddingTop: 8,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
  surveyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
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
  tipsContainer: {
    padding: 16,
    paddingTop: 8,
  },
  tipsScrollView: {
    marginLeft: -4,
  },
  tipCard: {
    width: width * 0.7,
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    marginLeft: 4,
  },
  tipIcon: {
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
  },
});

export default HomePage;
