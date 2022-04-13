// React native imports
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Appearance,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Theme
import colors from "../../config/colors";
import { ColorSchemeType } from "../../types";

//Icons
import { Ionicons } from '@expo/vector-icons';

// User queries
import * as UserQueries from "../../db/users";

// Default react component
export default () => {
  // Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const navigation = useNavigation<any>();

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
      padding: 20
    },
    loading: {
      color: colors[getColorScheme()].font.primary,
    },
    text: {
      fontSize: 14,
      color: colors[getColorScheme()].font.primary,
    },
    title: {
      fontWeight: "600",
      fontSize: 18,
      marginBottom: 20,
      marginTop: 20,
      color: colors[getColorScheme()].font.primary,
    },
    profilePic: {
      width: 150,
      height: 150,
      borderRadius: 1000,
      marginBottom: 5
    },
    edit: {
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 15
    },
    name: {
      fontSize: 20,
      fontWeight: "500",
      color: colors[getColorScheme()].font.primary,
      marginBottom: 5
    },
    userId: {
      fontWeight: "500",
      color: colors[getColorScheme()].font.accent,
    },

    settings: {
      width: '100%',
      marginTop: 20,
      borderRadius: 20,
      padding: 16,
      backgroundColor: colors[getColorScheme()].card,
    },
    element: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    divider: {
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: colors[getColorScheme()].font.primary,
      opacity: 0.1,
      marginTop: 10,
      marginBottom: 10
    },
    icon: {
      fontSize: 20,
      color: colors[getColorScheme()].font.primary,
      marginRight: 5
    }
  });

  // React component
  return (
    <View style={styles.container}>
      <Text style={styles.title} >Settings</Text>

      <Image style={styles.profilePic} source={{uri: 'https://shotkit.com/wp-content/uploads/2021/06/cool-profile-pic-matheus-ferrero.jpeg'}} />

      <Text style={[styles.text, styles.edit]} >Edit</Text>


      <TouchableOpacity>
        <Text style={styles.name} >Kalia Velarde</Text>
      </TouchableOpacity>

      <Text style={[styles.text, styles.userId]} >@KaliaVelarde345</Text>

      <View style={styles.settings} >
        <TouchableOpacity>
          <View style={styles.element} >
            <Ionicons name="ios-shield-checkmark" style={styles.icon} />
            <Text style={styles.text} >About this app</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} ></View>
        <TouchableOpacity onPress={UserQueries.userSignOut}>
          <View style={styles.element} >
            <Ionicons name="ios-exit-outline" style={styles.icon} />
            <Text style={styles.text} >Log out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
