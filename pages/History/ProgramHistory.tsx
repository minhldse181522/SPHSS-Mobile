import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { getProgramByUserId } from "../../service/api";
import { formatDate } from "../../utils/dateUtils";

interface Program {
  userId: string;
  programId: string;
  joinedAt: string;
  program: {
    programId: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    time: string;
    frequency: string;
    targetAudience: string;
    location: string;
    organizerEmail: string;
    contactPhone: string;
    imageUrl: string;
    price: string;
    rating: number;
    ratingCount: number | null;
    categoryId: string;
  };
}

interface User {
  id: number;
  email: string;
  firstName: string;
  gender: string;
  image: string;
  lastName: string;
  phone: string;
  userCode: string;
  username: string;
}

const ProgramHistory: React.FC = () => {
  const [data, setData] = useState<Program[]>([]);

  const renderItem = ({ item }: { item: Program }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.program.title}</Text>
      <Text style={styles.description}>{item.program.description}</Text>
      <Text style={styles.date}>
        📅 {formatDate(item.program.startDate)} →
        {formatDate(item.program.endDate)}
      </Text>
    </View>
  );

  useEffect(() => {
    const fetchSurveyData = async (): Promise<void> => {
      const storeUser = await AsyncStorage.getItem("userData");
      const user: User = JSON.parse(storeUser || "{}");
      try {
        const response = await getProgramByUserId(user.id);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };

    fetchSurveyData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lịch sử chương trình</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.program.programId}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Không có chương trình nào</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
    fontStyle: "italic",
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});

export default ProgramHistory;
