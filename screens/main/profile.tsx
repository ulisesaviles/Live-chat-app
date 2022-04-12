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
      <Text style={styles.title}>Profile</Text>

      <TouchableOpacity onPress={UserQueries.userSignOut}>
        <Text style={styles.loading}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};
