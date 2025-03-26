import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Program } from "../../models/program";
import { getProgram } from "../../service/api";

const { width } = Dimensions.get("window");

export type NavigationProps = {
  navigate: (screen: string, params?: any) => void;
};

function ProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProps>();

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await getProgram();
      if (response.data && response.data.data) {
        setPrograms(response.data.data);
      } else {
        console.log("No data in response:", response);
        setPrograms([]);
      }
    } catch (error: any) {
      console.error("Error fetching programs:", error);
      if (error.response) {
        console.error("Error response:", error.response);
      }
      setPrograms([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPrograms();
  };

  const handleProgramPress = (program: Program) => {
    navigation.navigate("ProgramDetail", { program });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const renderProgramItem = ({ item }: { item: Program }) => (
    <TouchableOpacity
      style={styles.programCard}
      onPress={() => handleProgramPress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.programImage}
        defaultSource={require("../../assets/Psychologist.png")}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
        style={styles.gradientOverlay}
      />
      <View style={styles.programInfo}>
        <Text style={styles.programName}>{item.name}</Text>
        <View style={styles.programDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color="#fff" />
            <Text style={styles.detailText}>
              {formatDate(item.startDate)} - {formatDate(item.endDate)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color="#fff" />
            <Text style={styles.detailText}>{item.time || "Flexible"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.programDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <MaterialIcons name="location-on" size={16} color="#3674B5" />
            <Text style={styles.metaText}>{item.location || "Online"}</Text>
          </View>

          {item.rating && (
            <View style={styles.metaItem}>
              <MaterialIcons name="star" size={16} color="#FFC107" />
              <Text style={styles.metaText}>{item.rating}</Text>
            </View>
          )}
        </View>

        <View style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Xem chi tiết</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3674B5" barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#3674B5", "#2A5A8E"]} style={styles.header}>
        <Text style={styles.headerTitle}>Chương trình tâm lý</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3674B5" />
          <Text style={styles.loadingText}>Đang tải chương trình...</Text>
        </View>
      ) : (
        <>
          {programs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="calendar-alt" size={60} color="#ccc" />
              <Text style={styles.emptyText}>Không có chương trình nào</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchPrograms}
              >
                <Text style={styles.retryButtonText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={programs}
              renderItem={renderProgramItem}
              keyExtractor={(item) => item.programId}
              contentContainerStyle={styles.listContainer}
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
                    Tham gia các chương trình tâm lý để được hỗ trợ phù hợp với
                    nhu cầu của bạn
                  </Text>
                </View>
              }
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
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
  retryButton: {
    backgroundColor: "#3674B5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
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
  programCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  programImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  programInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  programName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  programDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardContent: {
    padding: 16,
  },
  programDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  metaInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  joinButton: {
    backgroundColor: "#E8F0FB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  joinButtonText: {
    color: "#3674B5",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ProgramPage;
