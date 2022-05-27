import { useEffect, useState } from "react";
import {
  Appearance,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

//Theme
import colors from "../../../config/colors";
import { ColorSchemeType } from "../../../types";

//Icons
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// User queries

//Default react component
export default () => {
  //Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const navigation = useNavigation<any>();
  const dimensions = {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  };

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

  //Styles
  const styles = StyleSheet.create({
    backArrow: {
      marginRight: 15,
      fontSize: 22,
      position: "absolute",
      left: dimensions.width * 0.06,
    },
    container: {
      flex: 1,
      backgroundColor: colors[getColorScheme()].backgroundSecondary,
      alignItems: "center",
      paddingHorizontal: 20,
    },
    text: {
      fontSize: 14,
      color: colors[getColorScheme()].font.primary,
    },
    title: {
      fontWeight: "600",
      fontSize: 22,
      marginBottom: 20,
      marginTop: 15,
      color: colors[getColorScheme()].font.primary,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: dimensions.width * 0.05,
      width: dimensions.width,
    },

    setting: {
      fontSize: 16,
      marginLeft: 10,
    },
    settings: {
      width: "100%",
      marginTop: 10,
      borderRadius: 20,
      padding: 16,
      backgroundColor: colors[getColorScheme()].card,
    },
    element: {
      flexDirection: "row",
      alignItems: "center",
    },
    divider: {
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: colors[getColorScheme()].font.primary,
      opacity: 0.1,
      marginTop: 10,
      marginBottom: 10,
    },
    icon: {
      fontSize: 20,
      color: colors[getColorScheme()].font.accent,
      marginRight: 5,
    },
  });

  //React component

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="ios-arrow-back"
          style={[styles.icon, styles.backArrow]}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Edit profile</Text>
      </View>

      <View style={styles.settings}>
        <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")}>
          <View style={styles.element}>
            <Ionicons name="ios-lock-closed" style={styles.icon} />
            <Text style={[styles.text, styles.setting]}>Change password</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider}></View>

        <TouchableOpacity onPress={() => navigation.navigate("ChangeName")}>
          <View style={styles.element}>
            <Ionicons name="ios-person" style={styles.icon} />
            <Text style={[styles.text, styles.setting]}>
              Change profile name
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
