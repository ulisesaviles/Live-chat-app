// React native imports
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
  Dimensions,
} from "react-native";
import { Button } from "../../components/button";
import { useNavigation } from "@react-navigation/native";

// Theme
import colors from "../../config/colors";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Default react component
export default () => {
  // Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const navigation = useNavigation();
  const dimensions = {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
  };

  // Helpers
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

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[colorScheme!].background,
      alignItems: "center",
      paddingHorizontal: dimensions.width * 0.05,
      paddingTop: 30,
    },
    description: {
      color: colors[colorScheme!].font.primary,
      opacity: 0.5,
      fontSize: 20,
      marginBottom: 25,
      textAlign: "center",
    },
    featureContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      paddingHorizontal: dimensions.width * 0.05,
    },
    featureDescription: {
      color: colors[colorScheme!].font.primary,
      opacity: 0.5,
      fontSize: 18,
    },
    featureTextContainer: {
      flex: 1,
    },
    featureTitle: {
      color: colors[colorScheme!].font.accent,
      fontSize: 22,
      fontWeight: "600",
    },
    icon: {
      color: colors[colorScheme!].font.accent,
      fontSize: 30,
      marginRight: dimensions.width * 0.05,
    },
    keyFeatures: {
      fontWeight: "600",
      fontSize: 20,
      marginBottom: 10,
      color: colors[colorScheme!].font.primary,
    },
    separator: {
      height: 35,
    },
    title: {
      fontWeight: "600",
      fontSize: 50,
      marginBottom: 15,
      color: colors[colorScheme!].font.primary,
      textAlign: "center",
    },
    titleName: {
      color: colors[colorScheme!].font.accent,
      fontWeight: "800",
      fontStyle: "italic",
    },
  });

  // Data
  const features: {
    iconName: "ios-call" | "ios-people" | "ios-chatbubbles" | "ios-videocam";
    title: string;
    description: string;
  }[] = [
    {
      iconName: "ios-chatbubbles",
      title: "Real-time chat",
      description:
        "Communicate with your friends in real time. Send text or images!",
    },
    {
      iconName: "ios-people",
      title: "Find your friends!",
      description: "Use the search bar to look for your friends using the app!",
    },
    {
      iconName: "ios-videocam",
      title: "Video call",
      description: "Call your friends in a face-to-face call in real time!",
    },
    {
      iconName: "ios-call",
      title: "Audio call",
      description:
        "Bad hair day? no problem! call your friends via audio-only.",
    },
  ];

  // React component
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome to
        <Text style={styles.titleName}> Live Chat App</Text>!
      </Text>
      <Text style={styles.description}>
        Live Chat App is the newest messaging app that allows people all around
        the world communicate with their friends!
      </Text>
      <Text style={styles.keyFeatures}>Key features:</Text>
      {features.map((feature) => (
        <View style={styles.featureContainer} key={feature.title}>
          <Ionicons name={feature.iconName} style={styles.icon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        </View>
      ))}
      <View style={styles.separator} />
      <Button onPress={navigation.goBack} type="gradient" value="Start!" />
    </View>
  );
};
