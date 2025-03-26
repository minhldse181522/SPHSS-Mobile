import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { formatDate } from "../../utils/dateUtils";
import { getProgram, getProgramByUserId } from "../../service/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/routes";
import { Doctor } from "../../models/doctor";
import { Program } from "../../models/program";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProgramHistoryComponent = () => {
  const [programHistory, setProgramHistory] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(user!);
      const response = await getProgram();
      setProgramHistory(response.data.data);
    } catch (error) {
      console.error("Error fetching program history: ", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  console.log("programHistory", programHistory);

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang tham gia":
        return "#4CAF50";
      case "Hoàn thành":
        return "#3674B5";
      case "Hủy":
        return "#F44336";
      default:
        return "#FF9800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Đang tham gia":
        return "checkmark-circle";
      case "Hoàn thành":
        return "trophy";
      case "Hủy":
        return "close-circle";
      default:
        return "time";
    }
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="calendar-check" size={70} color="#DDD" />
      <Text style={styles.emptyText}>Bạn chưa tham gia chương trình nào</Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate("Program" as never)}
      >
        <LinearGradient
          colors={["#3674B5", "#2A5A8E"]}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.buttonText}>Tìm chương trình</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
  const handleProgramPress = (program: Program) => {
    // Use navigation.navigate to navigate to the screen within the same stack
    navigation.navigate("ProgramDetail", { program });
  };
  const renderProgramItem = ({ item }: { item: Program }) => {
    // const statusColor = getStatusColor(item.status);
    // const statusIcon = getStatusIcon(item.status);

    return (
      <TouchableOpacity
        style={styles.programCard}
        onPress={() => handleProgramPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.programImage}
              defaultSource={require("../../assets/Psychologist.png")}
            />
            {/* <View
              style={[styles.statusBadge, { backgroundColor: statusColor }]}
            >
              <Ionicons name={statusIcon} size={12} color="#FFF" />
              <Text style={styles.statusText}>{item.status}</Text>
            </View> */}
          </View>

          <View style={styles.programInfo}>
            <Text style={styles.programName}>{item.title}</Text>

            <View style={styles.programMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={14} color="#777" />
                <Text style={styles.metaText}>
                  {formatDate(item.startDate)} - {formatDate(item.endDate)}
                </Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={14} color="#777" />
                <Text style={styles.metaText}>
                  {item.location || "Trực tuyến"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Tiến độ</Text>
            <View style={styles.progressBarContainer}>
              {/* <View
                style={[
                  styles.progressBar,
                  {
                    width: `80%`,
                    backgroundColor: statusColor,
                  },
                ]}
              /> */}
            </View>
            <Text style={styles.progressPercentage}>80%</Text>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Tham gia:</Text>
            <Text style={styles.dateValue}>{formatDate(item.endDate)}</Text>
          </View>
        </View>

        <View style={styles.viewDetailsContainer}>
          <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
          <Ionicons name="chevron-forward" size={16} color="#3674B5" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3674B5" />
        <Text style={styles.loadingText}>Đang tải lịch sử chương trình...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={programHistory}
        keyExtractor={(item) => item.programId.toString()}
        renderItem={renderProgramItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3674B5"]}
          />
        }
      />
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
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  programCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  imageContainer: {
    position: "relative",
    marginRight: 12,
  },
  programImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  statusBadge: {
    position: "absolute",
    bottom: -8,
    left: -8,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 4,
  },
  programInfo: {
    flex: 1,
    justifyContent: "center",
  },
  programName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  programMeta: {
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#777",
    marginLeft: 4,
  },
  cardFooter: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressContainer: {
    flex: 1,
    marginRight: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#EEEEEE",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  dateContainer: {
    alignItems: "flex-end",
  },
  dateLabel: {
    fontSize: 12,
    color: "#666",
  },
  dateValue: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  viewDetailsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  viewDetailsText: {
    fontSize: 14,
    color: "#3674B5",
    fontWeight: "600",
    marginRight: 4,
  },
});

export default ProgramHistoryComponent;
