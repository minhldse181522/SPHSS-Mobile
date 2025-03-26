import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  RefreshControl,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Doctor } from "../../models/doctor";
import { useNavigation } from "@react-navigation/native";
import { getListDoctor } from "../../service/booking/api";
import {
  AntDesign,
  MaterialIcons,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export type NavigationProps = {
  navigate: (screen: string, params?: any) => void;
};

function PsyPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProps>();

  const handleDoctorPress = (doctor: Doctor) => {
    navigation.navigate("PsyDetail", { doctor });
  };

  const fetchDoctors = async () => {
    try {
      const response = await getListDoctor();
      if (response.data && response.data.data) {
        setDoctors(response.data.data);
      } else {
        console.log("No data in response:", response);
        setDoctors([]);
      }
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      if (error.response) {
        console.error("Error response:", error.response);
      }
      setDoctors([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDoctors();
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const renderStars = (rating = 5) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const color = i < rating ? "#FFC107" : "#E0E0E0";
      stars.push(
        <AntDesign
          key={i}
          name="star"
          size={16}
          color={color}
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => handleDoctorPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.doctorCardContent}>
        <Image
          source={{ uri: item.image }}
          style={styles.doctorImage}
          defaultSource={require("../../assets/Psychologist.png")}
        />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>
            {item.firstName + " " + item.lastName}
          </Text>
          <Text style={styles.doctorSpecialty}>Chuyên gia tâm lý</Text>

          {renderStars()}

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <FontAwesome name="briefcase" size={14} color="#666" />
              <Text style={styles.infoText}>15 năm kinh nghiệm</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <LinearGradient
              colors={["#3674B5", "#2A5A8E"]}
              style={styles.bookingButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Đặt lịch hẹn</Text>
            </LinearGradient>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3674B5" />
        <Text style={styles.loadingText}>Đang tải danh sách chuyên gia...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3674B5" barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#3674B5", "#2A5A8E"]} style={styles.header}>
        <Text style={styles.headerTitle}>Chuyên gia tâm lý</Text>
        <View style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#fff" />
        </View>
      </LinearGradient>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <MaterialIcons
          name="info"
          size={24}
          color="#3674B5"
          style={styles.infoIcon}
        />
        <Text style={styles.infoText}>
          Tư vấn cùng chuyên gia giúp bạn hiểu rõ về tình trạng sức khỏe tinh
          thần
        </Text>
      </View>

      {doctors.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="user-md" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Không tìm thấy chuyên gia</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDoctors}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={doctors}
          renderItem={renderDoctorItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3674B5"]}
            />
          }
        />
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
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: "#E8F0FB",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 12,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginVertical: 16,
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
    paddingTop: 8,
  },
  doctorCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
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
  doctorCardContent: {
    padding: 16,
    flexDirection: "row",
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#3674B5",
    marginBottom: 8,
    fontWeight: "500",
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
  },
  buttonContainer: {
    marginTop: 4,
  },
  bookingButton: {
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default PsyPage;
