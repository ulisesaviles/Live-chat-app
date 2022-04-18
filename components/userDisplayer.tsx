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
import { getData } from "../config/asyncStorage";

// Props interface
interface props {
  user: User;
  type: "onlyName" | "withLastMessage";
  onPress?: any;
  lastMessage?: { message: string; hour: string; senderId?: string };
  noMessage?: boolean;
  state?: string;
}

// Actual react component to return
export default ({ user, type, onPress, lastMessage, state }: props) => {
  // Constants
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const [myId, setMyId] = useState("");
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

  const handleFirstLoad = async () => {
    setFirstLoad(false);
    Appearance.addChangeListener(() => {
      setColorScheme(Appearance.getColorScheme());
    });
    const user: User = await getData("user", true);
    setMyId(user.userId!);
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
    hour: {
      color: colors[colorScheme!].font.secondary,
    },
    img: {
      width: 50,
      height: 50,
      marginRight: 20,
      borderRadius: 100,
    },
    message: {
      color: colors[colorScheme!].font.primary,
      maxWidth: dimensions.width * 0.9 - 140,
    },
    messageContainer: {
      flexWrap: "nowrap",
      flexDirection: "row",
      width: dimensions.width * 0.9 - 70,
      maxWidth: dimensions.width * 0.9 - 70,
      justifyContent: "space-between",
    },
    messageSentByMe: {
      color: colors[colorScheme!].font.secondary,
    },
    messageSentByHim: {
      color: colors[colorScheme!].font.primary,
    },
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
        ) : type === "withLastMessage" ? (
          <View style={styles.messageContainer}>
            <Text
              style={[
                styles.message,
                styles[
                  myId === lastMessage?.senderId
                    ? "messageSentByMe"
                    : "messageSentByHim"
                ],
              ]}
              numberOfLines={1}
            >
              {lastMessage === undefined || lastMessage.message === undefined
                ? `Say hello to ${user.name}👋`
                : `${myId === lastMessage.senderId ? "You: " : ""}${
                    lastMessage?.message
                  }`}
            </Text>
            <Text style={styles.hour}>
              {lastMessage?.message
                ? lastMessage?.hour
                : // ` • ${lastMessage?.hour}`
                  null}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
