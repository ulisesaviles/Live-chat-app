// Ract native imports
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Appearance,
  useColorScheme,
  TouchableOpacity,
  Dimensions,
} from "react-native";

// Expo imports
import { BlurView } from "expo-blur";

// Local imports
import colors from "../config/colors";
import { ColorSchemeType } from "../types";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Types
type screenNames = "home" | "friends" | "profile";
type icons = "ios-chatbubbles" | "ios-people" | "ios-person";
interface Config {
  [key: string]: {
    name: string;
    icon: icons;
  };
}

// Main react component
export default ({ state, descriptors, navigation }) => {
  // Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const config: Config = {
    home: { name: "Home", icon: "ios-chatbubbles" },
    friends: { name: "People", icon: "ios-people" },
    profile: { name: "Settings", icon: "ios-person" },
  };
  const dimensions = {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
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

  // On refresh
  useEffect(() => {
    if (firstLoad) {
      handleFirstLoad();
    }
  });

  const render = () => (
    <BlurView
      tint={getColorScheme()}
      intensity={100}
      style={{
        position: "absolute",
        bottom: 0,
        flex: 1,
        width: "100%",
      }}
    >
      <SafeAreaView style={styles.tabBar}>
        {state.routes.map(
          (route: { name: screenNames; key: string }, index: number) => {
            const { options } = descriptors[route.key];
            const tabName = route.name;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={{ alignItems: "center" }}
              >
                <View style={[styles.navigationBtn]}>
                  <Ionicons
                    size={30}
                    name={config[tabName].icon}
                    color={
                      colors[getColorScheme()].tabBar.icons[
                        isFocused ? "selected" : "unselected"
                      ]
                    }
                  />
                </View>
                <Text style={styles.text}>{config[tabName].name}</Text>
              </TouchableOpacity>
            );
          }
        )}
      </SafeAreaView>
    </BlurView>
  );

  const styles = StyleSheet.create({
    navigationBtn: {
      height: 37,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 5,
    },
    tabBar: {
      flexDirection: "row",
      backgroundColor: colors[getColorScheme()].tabBar.background,
      justifyContent: "space-evenly",
      paddingHorizontal: dimensions.width * 0.15,
    },
    text: {
      color: colors[getColorScheme()].font.primary,
      alignSelf: "center",
      fontSize: 12,
    },
  });

  return render();
};
