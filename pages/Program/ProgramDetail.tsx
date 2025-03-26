import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
} from "react-native";
import { Program } from "../../models/program";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { joinProgram } from "../../service/api";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type ProgramDetailRouteProp = RouteProp<
  {
    ProgramDetail: {
      program: Program;
    };
  },
  "ProgramDetail"
>;

function ProgramDetail() {
  const navigation = useNavigation();
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

      if (response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Tham gia chương trình thành công!",
          text1Style: { textAlign: "center", fontSize: 16 },
        });
      }
    } catch (error) {
      console.error("Error joining program:", error);
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra khi tham gia chương trình!",
        text1Style: { textAlign: "center", fontSize: 16 },
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent
      />

      {/* Image Header with Gradient Overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: program.imageUrl }}
          style={styles.image}
          defaultSource={require("../../assets/Psychologist.png")}
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.8)"]}
          style={styles.imageGradient}
        />

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Program Basic Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{program.name}</Text>
          <View style={styles.headerMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#fff" />
              <Text style={styles.metaText}>
                {formatDate(program.startDate)} - {formatDate(program.endDate)}
              </Text>
            </View>

            {program.rating && (
              <View style={styles.metaItem}>
                <Ionicons name="star" size={14} color="#FFC107" />
                <Text style={styles.metaText}>{program.rating} ⭐</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Join Button */}
          <TouchableOpacity
            style={styles.joinButton}
            onPress={handleJoinProgram}
          >
            <LinearGradient
              colors={["#3674B5", "#2A5A8E"]}
              style={styles.joinButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.joinButtonText}>Tham gia chương trình</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Description Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="description" size={20} color="#3674B5" />
              <Text style={styles.sectionTitle}>Giới thiệu</Text>
            </View>
            <Text style={styles.description}>{program.description}</Text>
          </View>

          {/* Schedule & Location Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="event" size={20} color="#3674B5" />
              <Text style={styles.sectionTitle}>Lịch trình & Địa điểm</Text>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="time-outline" size={18} color="#3674B5" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Thời gian</Text>
                  <Text style={styles.infoValue}>
                    {program.time || "Linh hoạt"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="repeat" size={18} color="#3674B5" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Tần suất</Text>
                  <Text style={styles.infoValue}>
                    {program.frequency || "N/A"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="location-outline" size={18} color="#3674B5" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Địa điểm</Text>
                  <Text style={styles.infoValue}>
                    {program.location || "Trực tuyến"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="people-outline" size={18} color="#3674B5" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Đối tượng</Text>
                  <Text style={styles.infoValue}>
                    {program.targetAudience || "Tất cả"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="contact-phone" size={20} color="#3674B5" />
              <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            </View>

            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={18} color="#666" />
              <Text style={styles.contactText}>{program.organizerEmail}</Text>
            </View>

            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={18} color="#666" />
              <Text style={styles.contactText}>{program.contactPhone}</Text>
            </View>
          </View>

          {/* Price Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="monetization-on" size={20} color="#3674B5" />
              <Text style={styles.sectionTitle}>Chi phí</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text
                style={[
                  styles.priceText,
                  program.price === "0" && styles.freeText,
                ]}
              >
                {program.price === "0" ? "Miễn phí" : program.price}
              </Text>
            </View>
          </View>

          {/* Instructors Section */}
          {program.instructors && program.instructors.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="school" size={20} color="#3674B5" />
                <Text style={styles.sectionTitle}>Giảng viên</Text>
              </View>

              {program.instructors.map((instructor, index) => (
                <View key={index} style={styles.instructorCard}>
                  <View style={styles.instructorIcon}>
                    <FontAwesome5 name="user-tie" size={20} color="#fff" />
                  </View>
                  <View style={styles.instructorContent}>
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
                </View>
              ))}
            </View>
          )}

          {/* Additional Info */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="info" size={20} color="#3674B5" />
              <Text style={styles.sectionTitle}>Thông tin bổ sung</Text>
            </View>
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalInfoText}>
                Chương trình được tạo vào {formatDate(program.createdAt)}
              </Text>
              <Text style={styles.additionalInfoText}>
                Cập nhật gần nhất: {formatDate(program.updatedAt)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  imageContainer: {
    height: 250,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  headerInfo: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentScroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  joinButton: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  joinButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  infoItem: {
    width: "50%",
    paddingHorizontal: 4,
    marginBottom: 16,
    flexDirection: "row",
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8F0FB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
  },
  priceContainer: {
    padding: 10,
    backgroundColor: "#E8F0FB",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  priceText: {
    fontSize: 16,
    color: "#3674B5",
    fontWeight: "bold",
  },
  freeText: {
    color: "#4CAF50",
  },
  instructorCard: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
  },
  instructorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3674B5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  instructorContent: {
    flex: 1,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  instructorTitle: {
    fontSize: 14,
    color: "#3674B5",
    fontWeight: "500",
    marginBottom: 4,
  },
  instructorExperience: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  instructorDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  additionalInfo: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
  },
  additionalInfoText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
});

export default ProgramDetail;
