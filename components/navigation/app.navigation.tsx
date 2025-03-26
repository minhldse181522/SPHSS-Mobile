import { Entypo, Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Pressable, Text, View } from "react-native";
import ChatAppPage from "../../pages/Chat";
import AppointmentSchedule from "../../pages/History/AppointmentSchedule";
import AppointmentReport from "../../pages/History/AppointmentReport";
import ProgramHistory from "../../pages/History/ProgramHistory";
import SurveyHistory from "../../pages/History/SurveyHistory";
import HomePage from "../../pages/Home";
import { NavigationProps } from "../../pages/Login";
import ProfilePage from "../../pages/Profile";
import ProgramPage from "../../pages/Program";
import ProgramDetail from "../../pages/Program/ProgramDetail";
import PsyPage from "../../pages/Psy";
import PsyDetail from "../../pages/Psy/PsyDetail";
import SurveyPage from "../../pages/Survey";
import SurveyDetail from "../../pages/SurveyDetail";
import {
  DrawerParamList,
  HistoryTabParamList,
  RootStackParamList,
  TabParamList,
} from "../../utils/routes";

export type AppStackParamList = {
  Login: undefined;
  AppNavigation: undefined;
};

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
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="program"
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

const HistoryLayout = () => {
  const Tab = createMaterialTopTabNavigator<HistoryTabParamList>();
  const Stack = createNativeStackNavigator();

  const HistoryTabs = () => {
    return (
      <View style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
        <View
          style={{
            backgroundColor: "#3674B5",
            paddingTop: 40,
            paddingBottom: 16,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 8,
            }}
          >
            Lịch sử hoạt động
          </Text>
        </View>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#3674B5",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              backgroundColor: "#fff",
            },
            tabBarIndicatorStyle: {
              backgroundColor: "#3674B5",
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
            options={{ title: "Khảo sát" }}
          />
          <Tab.Screen
            name="ProgramHistory"
            component={ProgramHistory}
            options={{ title: "Chương trình" }}
          />
          <Tab.Screen
            name="AppointmentSchedule"
            component={AppointmentSchedule}
            options={{ title: "Lịch hẹn" }}
          />
        </Tab.Navigator>
      </View>
    );
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HistoryTabs"
        component={HistoryTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProgramDetail"
        component={ProgramDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppointmentReport"
        component={AppointmentReport}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const BottomTabNavigation = () => {
  const Tab = createBottomTabNavigator<TabParamList>();
  const navigation = useNavigation();

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
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Survey"
        component={SurveyLayout}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
          title: "Khảo sát",
        }}
      />
      <Tab.Screen
        name="Psychologist"
        component={PsyLayout}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="schedule" size={size} color={color} />
          ),
          title: "Đặt lịch",
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryLayout}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
          title: "Lịch sử",
        }}
      />
      <Tab.Screen
        name="Menu"
        component={View}
        listeners={{
          tabPress: (e) => {
            // Prevent default behavior
            e.preventDefault();
            // @ts-ignore
            navigation.openDrawer();
          },
        }}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="menu" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

function AppNavigation() {
  const Drawer = createDrawerNavigator<DrawerParamList>();
  const navigation = useNavigation<NavigationProps>();
  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
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
            title: "Home",
          }}
        />
        <Drawer.Screen
          name="Program"
          component={ProgramLayout}
          options={{
            title: "Chương trình",
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfilePage}
          options={{
            title: "Thông tin hồ sơ",
          }}
        />
        <Drawer.Screen
          name="ChatApp"
          component={ChatAppPage}
          options={{
            title: "Chat App",
          }}
        />
      </Drawer.Navigator>
    </>
  );
}

export default AppNavigation;
