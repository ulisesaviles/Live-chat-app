// Imports from react native
import {
  Appearance,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  View,
} from "react-native";
import { useState, useEffect } from "react";

// Colors
import colors from "../config/colors";

// Interfaces
import { User } from "../interfaces";

// Import profile img
import profile from "../assets/profile.jpg";

// Props interface
interface props {
  user: User;
  type: "onlyName" | "withLastMessage";
  onPress?: any;
  lastMessage?: { message: string; hour: string };
  noMessage?: boolean;
  state?: string;
}

// Actual react component to return
export default ({ user, type, onPress, lastMessage, state }: props) => {
  // Constants
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const dimensions = {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
  };

  // Functions
  const capitalize = (phrase: string): string => {
    phrase = phrase.trim();
    const phraseAsArray: string[] = phrase.split(" ");
    let phraseAsStr: string = "";
    for (let i = 0; i < phraseAsArray.length; i++) {
      const word = phraseAsArray[i];
      phraseAsStr += word.charAt(0).toUpperCase();
      phraseAsStr += word.substring(1) + " ";
    }
    return phraseAsStr;
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

  // Styles
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: dimensions.width * 0.05,
      flexDirection: "row",
      height: 60,
      alignItems: "center",
    },
    hour: {},
    img: {
      width: 50,
      height: 50,
      marginRight: 20,
      borderRadius: 100,
    },
    message: {},
    name: {
      color: colors[colorScheme!].font.primary,
      fontSize: 18,
      fontWeight: "500",
      maxWidth: dimensions.width * 0.9 - 70,
      overflow: "hidden",
    },
    state: {
      color: colors[colorScheme!].font.primary,
    },
    textContainer: {
      height: "100%",
      justifyContent: "center",
    },
    userName: {
      color: colors[colorScheme!].font.accent,
      fontWeight: "500",
    },
  });

  // TSX component
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        source={user.pictureUrl ? { uri: user.pictureUrl } : profile}
        style={styles.img}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {capitalize(user.name!)}
        </Text>
        {type === "onlyName" ? (
          <Text style={styles.userName}>
            @{user.userName}
            <Text style={styles.state}>{state ? ` • ${state}` : null}</Text>
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
