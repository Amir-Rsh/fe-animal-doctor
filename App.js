import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./components/Home";
import Report from "./components/Report";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./components/Login";
import { StatusBar } from "react-native";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer
      style={{ backgroundColor: "sandybrown", marginTop: 0 }}
    >
      <StatusBar backgroundColor="sandybrown" barStyle="dark-content" />

      <Drawer.Navigator
        screenOptions={{
          backgroundColor: "sandybrown",
          headerTintColor: "black",
          drawerLabelStyle: { fontSize: 20 },
          headerStyle: { backgroundColor: "sandybrown" },
          drawerStyle: { backgroundColor: "sandybrown" },
          drawerInactiveTintColor: "black",
          drawerActiveTintColor: "brown",
        }}
        initialRouteName="Home"
      >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Report" component={Report} />
        <Drawer.Screen name="Rescue check" component={Login} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
