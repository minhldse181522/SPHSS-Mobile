import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface UserData {
  id: string;
  userCode: string;
  firstName: string;
  lastName: string;
  image: string;
  username: string;
  email: string;
  phone: string;
  gender: string;
  roleCode: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userData");
        if (userDataString) {
          setUserData(JSON.parse(userDataString));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{ uri: userData.image }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{`${userData.firstName} ${userData.lastName}`}</Text>
          <Text style={styles.username}>@{userData.username}</Text>
        </View>

        <View style={styles.infoSection}>
          <InfoItem label="Email" value={userData.email} />
          <InfoItem label="Số điện thoại" value={userData.phone} />
          <InfoItem label="Giới tínhtính" value={userData.gender} />
          <InfoItem label="Mã người dùngdùng" value={userData.userCode} />
          <InfoItem label="Mã vai trò" value={userData.roleCode} />
          <InfoItem label="Miêu tả" value={userData.description} />
          <InfoItem
            label="Thành viên từ"
            value={new Date(userData.createdAt).toLocaleDateString()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#3674B5",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  infoSection: {
    padding: 20,
  },
  infoItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});

export default ProfilePage;
