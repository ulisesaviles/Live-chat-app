// React native imports
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
} from "react-native";

// Theme
import colors from "../../config/colors";
import { ColorSchemeType } from "../../types";

// Default react component
export default () => {
  // Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);

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
      <Text style={styles.title}>Welcome</Text>
    </View>
  );
};
