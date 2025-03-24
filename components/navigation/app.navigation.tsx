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
      {/* <Stack.Screen
        name="profile"
        options={{ title: "Products" }}
        component={ProfilePage}
      /> */}
      {/* <Stack.Screen
        name="product-detail"
        options={{ title: "StudentDetail" }}
        component={ProductDetailScreen}
      /> */}
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
        component={SurveyPage}
        options={{
          tabBarIcon: () => (
            <AntDesign name="profile" size={24} color="black" />
          ),
          title: "Khảo sát",
        }}
      />
      <Tab.Screen
        name="Psychologist"
        component={PsyPage}
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
      </Drawer.Navigator>
    </>
  );
}

export default AppNavigation;
