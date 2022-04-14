import { useEffect, useState } from "react";
import {
  Appearance,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";

//Theme
import colors from "../../../config/colors";
import { ColorSchemeType } from "../../../types";

//Icons
import { Ionicons } from '@expo/vector-icons';

// User queries

//Default react component
export default () => {
  //Constants
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

  //Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[getColorScheme()].background,
      alignItems: "center",
      padding: 20
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

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
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

  //React component

  return (
    <View style={styles.container} >

      <View style={styles.header} >
        <Ionicons name="ios-arrow-back" style={styles.icon} onPress={() => navigation.goBack()} />
        <Text style={styles.title} >Edit profile</Text>
      </View>

      <View style={styles.settings} >
        <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
          <View style={styles.element} >
            <Ionicons name="ios-lock-closed" style={styles.icon} />
            <Text style={styles.text} >Change password</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} ></View>
        
        <TouchableOpacity>
          <View style={styles.element} >
            <Ionicons name="ios-person" style={styles.icon} />
            <Text style={styles.text} >Change profile name</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}