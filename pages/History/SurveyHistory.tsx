import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SurveyHistory = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử khảo sát</Text>
      <Text>Chưa có dữ liệu khảo sát.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default SurveyHistory;