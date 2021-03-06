// React native imports
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Expo imports
import { StatusBar } from "expo-status-bar";

// Theme
import colors from "../config/colors";
import { ColorSchemeType } from "../types";

// User queries
import * as UserQueries from "../db/users";
import { removeData, setData } from "../config/asyncStorage";

export default () => {
  // ColorScheme
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const navigation = useNavigation<any>();

  // Helpers
  const getColorScheme = () => {
    let tempColorScheme: ColorSchemeType = "light";
    if (colorScheme === "dark") tempColorScheme = "dark";
    return tempColorScheme;
  };

  const handleFirstLoad = () => {
    setFirstLoad(false);
    Appearance.addChangeListener(() => {
      setColorScheme(Appearance.getColorScheme());
    });
    UserQueries.createAuthListener(
      async (userId: string) => {
        const user = await UserQueries.getUserDoc(userId);
        await setData(user, "user");
        navigation.navigate("Main");
      },
      async () => {
        await removeData("user");
        navigation.navigate("Root");
        setTimeout(() => navigation.navigate("Login"), 50);
      }
    );
  };

  // On refresh
  useEffect(() => {
    if (firstLoad) {
      handleFirstLoad();
    }
  });

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[getColorScheme()].background,
      alignItems: "center",
      justifyContent: "center",
    },
    loading: {
      color: colors[getColorScheme()].font.primary,
    },
  });

  // React component
  return (
    <View style={styles.container}>
      <Text style={styles.loading}>Loading...</Text>
      <StatusBar style={"auto"} />
    </View>
  );
};
