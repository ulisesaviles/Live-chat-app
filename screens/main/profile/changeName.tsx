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

// Queries
import * as UserQueries from "../../../db/users";
import { getData, setData } from "../../../config/asyncStorage";

export default () => {
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const [name, setName] = useState("");
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
  const onChangeName = (value: string) => {
    setName(value);
  };

  const changeName = async () => {
    if (name !== "") {
      const user: any = await getData("user", true);
      const updatedUser = await UserQueries.updateUser(
        user.userId,
        { name },
        true
      );
      if (updatedUser) {
        setData(updatedUser, "user");
      }
      navigation.navigate("Profile", { needsToReload: true });
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
        <Text style={styles.title}>Change name</Text>
      </View>

      <Input
        type="name"
        label="New name"
        placeholder="type your name"
        onChangeText={onChangeName}
        secureTextEntry={false}
      />
      <View style={{ height: 5 }} />

      <Button type="gradient" value="Change name" onPress={changeName} />
    </SafeAreaView>
  );
};
