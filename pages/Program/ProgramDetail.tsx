import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Program } from "../../models/program";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { joinProgram } from "../../service/api";

type ProgramDetailRouteProp = RouteProp<
  {
    ProgramDetail: {
      program: Program;
    };
  },
  "ProgramDetail"
>;

function ProgramDetail() {
  const route = useRoute<ProgramDetailRouteProp>();
  const { program } = route.params;
  const handleJoinProgram = async () => {
    try {
      const storeUser = await AsyncStorage.getItem("userData");
      const user = JSON.parse(storeUser || "{}");
      if (!user.id) {
        Toast.show({
          type: "error",
          text1: "Vui lòng đăng nhập để tham gia chương trình!",
          text1Style: { textAlign: "center", fontSize: 16 },
        });
        return;
      }
      const response = await joinProgram(user.id, program.programId);
      console.log({ response });

      if (response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Tham gia chương trình thành công!",
          text1Style: { textAlign: "center", fontSize: 16 },
        });
      }
    } catch (error) {
      console.error("Error joining program:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: program.imageUrl }}
          style={styles.image}
          defaultSource={require("../../assets/Psychologist.png")}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{program.name}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: program.status ? "#4CAF50" : "#FF5722" },
              ]}
            >
              <TouchableOpacity onPress={handleJoinProgram}>
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}
                >
                  Tham gia
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{program.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Duration</Text>
            <View style={styles.dateContainer}>
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <Text style={styles.dateValue}>
                  {new Date(program.startDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>End Date</Text>
                <Text style={styles.dateValue}>
                  {new Date(program.endDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Created At</Text>
              <Text style={styles.infoValue}>
                {new Date(program.createdAt).toLocaleString()}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>
                {new Date(program.updatedAt).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule & Location</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{program.time}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Frequency</Text>
              <Text style={styles.infoValue}>{program.frequency}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{program.location}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Organizer Email</Text>
              <Text style={styles.infoValue}>{program.organizerEmail}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Contact Phone</Text>
              <Text style={styles.infoValue}>{program.contactPhone}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Program Details</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Target Audience</Text>
              <Text style={styles.infoValue}>{program.targetAudience}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>
                {program.price === "0" ? "Free" : program.price}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Rating</Text>
              <Text style={styles.infoValue}>{program.rating} ⭐</Text>
            </View>
          </View>

          {program.instructors && program.instructors.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructors</Text>
              {program.instructors.map((instructor, index) => (
                <View key={index} style={styles.instructorItem}>
                  <Text style={styles.instructorName}>
                    {instructor.instructorName}
                  </Text>
                  {instructor.instructorTitle && (
                    <Text style={styles.instructorTitle}>
                      {instructor.instructorTitle}
                    </Text>
                  )}
                  {instructor.instructorExperience && (
                    <Text style={styles.instructorExperience}>
                      {instructor.instructorExperience}
                    </Text>
                  )}
                  {instructor.instructorDescription && (
                    <Text style={styles.instructorDescription}>
                      {instructor.instructorDescription}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  instructorItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  instructorTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  instructorExperience: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  instructorDescription: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});

export default ProgramDetail;
