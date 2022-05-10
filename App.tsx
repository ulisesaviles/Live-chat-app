// Navigation imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

// Screens
import Root from "./screens/root";
import Login from "./screens/login";
import Main from "./screens/main";
import Chat from "./screens/chat/chat";
import Call from "./screens/call/call";
import Welcome from "./screens/login/welcome";
import AddFriend from "./screens/main/addFriend";
import SignUp from "./screens/login/SignUp";
import { ProfileModal } from "./screens/chat/profileModal";
import { TransitionPresets } from "@react-navigation/stack";

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
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FriendProfile"
        component={ProfileModal}
        options={{ headerShown: false, ...TransitionPresets.ModalSlideFromBottomIOS, gestureEnabled: true, presentation: 'modal'  }}
      />
      <Stack.Screen
        name="Call"
        component={Call}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddFriend"
        component={AddFriend}
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
