import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, Text } from "react-native";
import HomePage from "../../pages/Home";
import ProfilePage from "../../pages/Profile";
import PsyPage from "../../pages/Psy";
import SurveyPage from "../../pages/Survey";
import { RootStackParamList } from "../../utils/routes";
import ProgramPage from "../../pages/Program";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../../pages/Login";
import ProgramDetail from "../../pages/Program/ProgramDetail";
import PsyDetail from "../../pages/Psy/PsyDetail";
import SurveyDetail from "../../pages/SurveyDetail";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from '@react-navigation/native';
import AppointmentSchedule from "../../pages/History/AppointmentSchedule";
import ProgramHistory from "../../pages/History/ProgramHistory";
import SurveyHistory from "../../pages/History/SurveyHistory";


const HomeLayout = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="home"
        component={HomePage}
        options={{
          title: "Trang chủ",
        }}
      />
    </Stack.Navigator>
  );
};
const ProgramLayout = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Program"
        component={ProgramPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProgramDetail"
        component={ProgramDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const PsyStack = createNativeStackNavigator<RootStackParamList>();

const PsyLayout = () => {
  return (
    <PsyStack.Navigator>
      <PsyStack.Screen
        name="psy"
        component={PsyPage}
        options={{ headerShown: false }}
      />
      <PsyStack.Screen
        name="PsyDetail"
        component={PsyDetail}
        options={{ headerShown: false }}
      />
    </PsyStack.Navigator>
  );
};

const SurveyLayout = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Survey"
        component={SurveyPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SurveyDetail"
        component={SurveyDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
const HisotryLayout = () => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#007AFF",
          height: 3,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "600",
          textTransform: "none",
        },
      }}
    >
      <Tab.Screen
        name="SurveyHistory"
        component={SurveyHistory}
        options={{ title: "Lịch sử khảo sát" }}
      />
      <Tab.Screen
        name="ProgramHistory"
        component={ProgramHistory}
        options={{ title: "Lịch sử chương trình" }}
      />
      <Tab.Screen
        name="AppointmentSchedule"
        component={AppointmentSchedule}
        options={{ title: "Lịch hẹn khám" }}
      />
    </Tab.Navigator>
  );
};

const BottomTabNavigation = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3674B5",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#f8f8f8", paddingBottom: 5 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeLayout}
        options={{
          tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
        }}
      />
      <Tab.Screen
        name="Survey"
        component={SurveyLayout}
        options={{
          tabBarIcon: () => (
            <AntDesign name="profile" size={24} color="black" />
          ),
          title: "Khảo sát",
        }}
      />
      <Tab.Screen
        name="Psychologist"
        component={PsyLayout}
        options={{
          tabBarIcon: () => (
            <MaterialIcons name="schedule" size={24} color="black" />
          ),
          title: "Đặt lịch",
        }}
      />

    </Tab.Navigator>
  );
};

function AppNavigation() {
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation<NavigationProps>();
  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          // headerShown: false,
          drawerItemStyle: {
            backgroundColor: "#9dd3c8",
            borderColor: "black",
            width: "100%",
            opacity: 0.6,
          },
        }}
        drawerContent={(props) => (
          <>
            <Text
              style={{
                padding: 16,
                fontSize: 20,
                fontWeight: "bold",
                color: "#3674B5",
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
                marginTop: 30,
              }}
            >
              YAG HEALTH - STUDENT
            </Text>
            {props.descriptors &&
              Object.entries(props.descriptors).map(
                ([key, descriptor], index) => (
                  <Pressable
                    key={key}
                    onPress={() =>
                      props.navigation.navigate(descriptor.route.name)
                    }
                    style={({ pressed }) => ({
                      backgroundColor: pressed
                        ? "#f0f0f0"
                        : props.state.index === index
                          ? "#A1E3F9"
                          : "transparent",
                      borderRadius: 8,
                    })}
                  >
                    <Text
                      style={{
                        padding: 16,
                        color: props.state.index === index ? "#3674B5" : "#333",
                        fontWeight:
                          props.state.index === index ? "600" : "normal",
                        fontSize: 16,
                      }}
                    >
                      {descriptor.options.title || descriptor.route.name}
                    </Text>
                  </Pressable>
                )
              )}
            <Pressable
              onPress={() => navigation.navigate("Login")}
              style={({ pressed }) => ({
                marginTop: 10,
                padding: 16,
                width: 300,
                backgroundColor: pressed ? "tomato" : "#3674B5",
                borderRadius: 8,
                alignSelf: "center",
              })}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Đăng xuất
              </Text>
            </Pressable>
          </>
        )}
      >
        <Drawer.Screen
          name="HomeTabs"
          component={BottomTabNavigation}
          options={{
            headerStyle: { backgroundColor: "#3674B5" },
            headerTintColor: "#fff",
            title: "Home",
          }}
        />
        <Drawer.Screen
          name="Program"
          component={ProgramLayout}
          options={{
            headerStyle: { backgroundColor: "#3674B5" },
            headerTintColor: "#fff",
            title: "Chương trình",
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfilePage}
          options={{
            headerStyle: { backgroundColor: "#3674B5" },
            headerTintColor: "#fff",
            title: "Thông tin hồ sơ",
          }}
        />
        <Drawer.Screen
          name="History"
          component={HisotryLayout}
          options={{
            headerStyle: { backgroundColor: "#3674B5" },
            headerTintColor: "#fff",
            title: "Lịch sử",
          }}
        />
      </Drawer.Navigator>
    </>
  );
}

export default AppNavigation;
