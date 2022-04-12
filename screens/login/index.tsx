// React native imports
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Theme
import colors from "../../config/colors";
import { ColorSchemeType } from "../../types";

// User queries
import * as UserQueries from "../../db/users";

// Default react component
export default () => {
  // Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
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
  };

  // Functions
  const signIn_ = async () => {
    const user = await UserQueries.userSignIn(
      "ulisesaviles.dev@gmail.com",
      "Amomiferrari1"
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
    login: {
      color: colors[getColorScheme()].font.primary,
      marginBottom: 10,
    },
    title: {
      fontWeight: "500",
      fontSize: 22,
      marginBottom: 20,
      color: colors[getColorScheme()].font.primary,
    },
  });

  // React component
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TouchableOpacity onPress={signIn_}>
        <Text style={styles.login}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.login}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};
