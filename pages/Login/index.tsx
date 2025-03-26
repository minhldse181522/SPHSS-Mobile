import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { loginUser } from "../../service/api";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ILoginScreenProps {
  onEyePress?: () => void;
}

export type NavigationProps = {
  navigate: (screen: string) => void;
};

const LoginPage: React.FC<ILoginScreenProps> = ({ onEyePress }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = React.useState("");
  const navigation = useNavigation<NavigationProps>();

  const handleEyePress = () => {
    setPasswordVisible((oldValue) => !oldValue);
    onEyePress?.();
  };

  const handleLogin = async () => {
    try {
      console.log(userName, password);
      const response = await loginUser({ username: userName, password });
      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Đăng nhập thành công!",
          text1Style: { textAlign: "center", fontSize: 16 },
        });
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(response.data.user)
        );
        navigation.navigate("AppNavigation");
      } else {
        Toast.show({
          type: "error",
          text1: "Tài khoản hoặc mật khẩu không đúng!",
          text1Style: { textAlign: "center", fontSize: 16 },
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.aboveContent}>
            <Image
              source={require("../../assets/Psychologist.png")}
              style={styles.imageContent}
            />
          </View>
        </SafeAreaView>
        <View style={styles.belowContent}>
          <View style={styles.loginForm}>
            <Text style={styles.header}>Login</Text>
            <Text style={styles.label}>Username</Text>
            <TextInput
              onChangeText={setUserName}
              value={userName}
              placeholder="Username"
              style={styles.input}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              style={styles.input}
              secureTextEntry
            />
            <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
              <Text style={styles.txtLogin}>LOGIN</Text>
            </TouchableOpacity>
            <Text style={styles.option}>
              Or <Text style={styles.register}>Register</Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3674B5",
  },
  safeArea: {
    display: "flex",
  },
  aboveContent: {
    flexDirection: "row",
    justifyContent: "center",
  },
  imageContent: {
    marginTop: 60,
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  belowContent: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  header: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    color: "#ec744a",
  },
  label: {
    marginTop: 10,
    marginLeft: 35,
    color: "#08509f",
  },
  input: {
    padding: 16,
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderRadius: 16,
    width: 350,
    marginLeft: 20,
  },
  btnLogin: {
    marginTop: 20,
    marginLeft: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#ec744a",
    borderRadius: 12,
    width: 350,
  },
  txtLogin: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  option: {
    textAlign: "center",
    marginTop: 25,
    fontSize: 16,
  },
  register: {
    color: "#08509f",
    textDecorationLine: "underline",
  },
});

export default LoginPage;
