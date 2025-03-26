import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ChatAppPage from "../pages/Chat";

interface MiniChatAppProps {
  onClose: () => void;
}

const MiniChatAppPage: React.FC<MiniChatAppProps> = ({ onClose }) => {
  // Custom style overrides để ẩn một số phần của ChatAppPage
  const styleOverrides = StyleSheet.create({
    container: {
      borderRadius: 16,
      overflow: "hidden",
    },
    header: {
      paddingTop: 45, // Tạo khoảng trống cho nút đóng
    },
    closeButtonWrapper: {
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 1000,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styleOverrides.container}>
      <ChatAppPage />
      {/* Nút đóng custom */}
      <View style={styleOverrides.closeButtonWrapper}>
        <TouchableOpacity style={styleOverrides.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MiniChatAppPage;
