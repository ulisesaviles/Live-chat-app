// Tab navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();

// Import screens
import Home from "./home";
import Friends from "./friends";
// import Profile from "./profile/profile";
import { ProfileStack } from "./profile/profileStack";

// Import tabBat
import TabBar from "../../components/TabBar";

// Default react component
export default () => {
  // React component
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen
        name="home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="friends"
        component={Friends}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};
