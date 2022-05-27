import { useEffect, useState } from "react";
import {
  Appearance,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

//Theme
import colors from "../../../config/colors";
import { ColorSchemeType } from "../../../types";

//Icons
import { Ionicons } from "@expo/vector-icons";

//Components
import { Input } from "../../../components/input";
import { Button } from "../../../components/button";

// Types
import { User } from "../../../interfaces";
import { getData } from "../../../config/asyncStorage";

//Default react component
export default () => {
  //Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigation = useNavigation<any>();
  const [user, setUser]: [User | null, any] = useState({});
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

  const handleFirstLoad = async () => {
    setFirstLoad(false);
    Appearance.addChangeListener(() => {
      setColorScheme(Appearance.getColorScheme());
    });
    setUser(await getData("user", true));
  };

  const newPasswordsMatch = () => {
    return newPassword === confirmNewPassword && newPassword !== "";
  };

  const oldPasswordIsCorrect = () => {
    return true;
  };

  // Functions
  const onChangeOldPassword = (value: string) => {
    setOldPassword(value);
  };
  const onChangeNewPassword = (value: string) => {
    setNewPassword(value);
  };
  const onChangeConfirmNewPassword = (value: string) => {
    setConfirmNewPassword(value);
  };

  const changePassword = () => {
    if (newPasswordsMatch() && oldPasswordIsCorrect()) {
      console.log("Password changed");
    }
  };

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
      marginBottom: 20,
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
        <Text style={styles.title}>Change password</Text>
      </View>

      {/* <Input
        type="password"
        label="Old password"
        placeholder="type your old password"
        onChangeText={onChangeOldPassword}
        secureTextEntry={true}
      /> */}
      <Input
        type="password"
        label="New password"
        placeholder="type your new password"
        onChangeText={onChangeNewPassword}
        secureTextEntry={true}
      />

      <Input
        type="password"
        label="Confirm new password"
        placeholder="type your old password"
        onChangeText={onChangeConfirmNewPassword}
        secureTextEntry={true}
      />

      <Button
        type="gradient"
        value="Change password"
        onPress={changePassword}
      />
    </SafeAreaView>
  );
};
