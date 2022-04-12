// Navigation imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

// Screens
import Root from "./screens/root";
import Login from "./screens/login";
import Main from "./screens/main";

// Default react component to export
export default () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={Root}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Main"
        component={Main}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
