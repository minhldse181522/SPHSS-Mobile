import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Doctor } from "../../models/doctor";
import { useNavigation } from "@react-navigation/native";
import { getListDoctor } from "../../service/booking/api";
import AntDesign from "@expo/vector-icons/AntDesign";

export type NavigationProps = {
  navigate: (screen: string, params?: any) => void;
};

function PsyPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProps>();

  const handleDoctorPress = (doctor: Doctor) => {
    navigation.navigate("PsyDetail", { doctor });
  };

  useEffect(() => {
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
      }
    };
    fetchDoctors();
  }, []);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<AntDesign key={i} name="star" size={24} color="#27548A" />);
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => handleDoctorPress(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.doctorImage}
        defaultSource={require("../../assets/Psychologist.png")}
      />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>
          {item.firstName + " " + item.lastName}
        </Text>
        <Text style={styles.doctorDescription} numberOfLines={2}>
          Chuyên gia tâm lý
        </Text>
        {renderStars()}
        <View style={styles.doctorMeta}>
          <Text style={styles.dateText}>15 năm kinh nghiệm</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3674B5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={doctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  doctorCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
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
  doctorImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  doctorInfo: {
    padding: 16,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  doctorDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  doctorMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#888",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default PsyPage;
