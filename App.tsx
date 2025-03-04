import { NavigationContainer } from "@react-navigation/native";
import LoginPage from "./pages/Login";
import AppNavigation from "./components/navigation/app.navigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="AppNavigation" component={AppNavigation} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
