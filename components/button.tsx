import { LinearGradient } from "expo-linear-gradient";
import {
  Appearance,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import colors from "../config/colors";

// Constants
const dimensions = {
  height: Dimensions.get("screen").height,
  width: Dimensions.get("screen").width,
};

const getColorScheme = () => {
  return Appearance.getColorScheme() || "dark";
};

interface ButtonProps {
  type: "primary" | "gradient";
  value: string;
  onPress: any;
  small?: boolean;
}

export const Button = (props: ButtonProps): JSX.Element => {
  const styles = StyleSheet.create({
    text: {
      color: "white",
      fontSize: !props.small ? 22 : 16,
      fontWeight: "500",
    },
    primaryBtn: {
      paddingVertical: !props.small ? 8 : 3,
      paddingHorizontal: !props.small ? 50 : 15,
      borderRadius: !props.small ? 20 : 11,
      backgroundColor: colors[getColorScheme()].btn.background,
      marginTop: dimensions.height * 0.025,
      marginBottom: 20,
    },
    gradientBtn: {
      paddingVertical: !props.small ? 8 : 3,
      paddingHorizontal: !props.small ? 50 : 15,
      borderRadius: !props.small ? 20 : 11,
    },
  });

  return props.type === "primary" ? (
    <TouchableOpacity onPress={props.onPress} style={styles.primaryBtn}>
      <Text style={styles.text}>Log in</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={props.onPress}>
      <LinearGradient
        colors={colors[getColorScheme()].gradients.main}
        style={styles.gradientBtn}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.text}>{props.value}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
