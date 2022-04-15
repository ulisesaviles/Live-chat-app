// Imports from react native
import {
  Appearance,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

// Colors
import colors from "../config/colors";
import { User } from "../interfaces";

// Constants
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
    phraseAsStr += word.charAt(0).toLowerCase();
    phraseAsStr += word.substring(1) + " ";
  }
  return phraseAsStr;
};

const getColorScheme = () => {
  return Appearance.getColorScheme() || "dark";
};

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 22,
    fontWeight: "500",
  },
  primaryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 50,
    borderRadius: 20,
    backgroundColor: colors[getColorScheme()].btn.background,
    marginTop: dimensions.height * 0.025,
    marginBottom: 20,
  },
  gradientBtn: {
    paddingVertical: 8,
    paddingHorizontal: 50,
    borderRadius: 20,
  },
});

interface props {
  user: User;
  type?: "onlyName" | "withLastMessage";
  onPress?: any;
  lastMessage?: { message: string; hour: string };
}

export default ({ user, type, onPress, lastMessage }: props) => {
  return <Text>{capitalize(user.name!)}</Text>;
};
