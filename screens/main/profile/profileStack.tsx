//React imports
import { createNativeStackNavigator } from "@react-navigation/native-stack"

//Screens
import Profile from "./profile"
import EditProfile from "./editProfile"
import ChangePassword from "./changePassword"
import ChangeName from "./changeName"

// Constants
const Stack = createNativeStackNavigator();

export const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={Profile}
        options={{
          headerShown: false
        }}></Stack.Screen>
      <Stack.Screen name="EditProfile" component={EditProfile}
        options={{
          headerShown: false,
          gestureEnabled: true
        }}></Stack.Screen>
      <Stack.Screen name="ChangePassword" component={ChangePassword}
        options={{
          headerShown: false,
          gestureEnabled: true
        }}></Stack.Screen>
      <Stack.Screen name="ChangeName" component={ChangeName}
        options={{
          headerShown: false,
          gestureEnabled: true
        }}></Stack.Screen>
    </Stack.Navigator>
  )
}