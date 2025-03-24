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
import { getProgram } from "../../service/api";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Program } from "../../models/program";



export type NavigationProps = {
  navigate: (screen: string, params?: any) => void;
};

function ProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProps>();
  
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await getProgram();
        console.log("API Response:", response);
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
      }
    };
    fetchPrograms();
  }, []);

  const handleProgramPress = (program: Program) => {
    navigation.navigate("ProgramDetail", { program });
  };

  const renderProgramItem = ({ item }: { item: Program }) => (
    <TouchableOpacity
      style={styles.programCard}
      onPress={() => handleProgramPress(item)}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.programImage}
        defaultSource={require("../../assets/Psychologist.png")}
      />
      <View style={styles.programInfo}>
        <Text style={styles.programName}>{item.name}</Text>
        <Text style={styles.programDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.programMeta}>
          <Text style={styles.dateText}>
            {new Date(item.startDate).toLocaleDateString()} -{" "}
            {new Date(item.endDate).toLocaleDateString()}
          </Text>
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
        data={programs}
        renderItem={renderProgramItem}
        keyExtractor={(item) => item.programId}
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
  programCard: {
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
  programImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  programInfo: {
    padding: 16,
  },
  programName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  programDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  programMeta: {
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

export default ProgramPage;
