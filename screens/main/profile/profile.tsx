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

import * as ImagePicker from 'expo-image-picker';

// Theme
import colors from "../../../config/colors";
import { ColorSchemeType } from "../../../types";

//Icons
import { Ionicons } from '@expo/vector-icons';

// User queries
import * as UserQueries from "../../../db/users";
import { getData } from "../../../config/asyncStorage";

//Interfaces
import { User } from "../../../interfaces";
import { SafeAreaView } from "react-native-safe-area-context";

// Default react component
export default ({navigation}: any) => {
  // Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profilePic, setPic] = useState('');

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
  const getUser = async () => {
    try {
      const currentUser: any = await getData('user', true);
      setUser(currentUser);
      if (currentUser.pictureUrl) {
        setPic(currentUser.pictureUrl);
      }
    }
    catch(error) {
      console.log(error);
    }
  }

  const chooseProfilePic = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1
    });


    if (!res.cancelled) {
      UserQueries.changeProfilePic(user?.userId!, res.uri);
      setPic(res.uri);
    }
  }

  // On refresh
  useEffect(() => {
    if (firstLoad) {
      handleFirstLoad();
      getUser();
    }
    const unsubscribe = navigation.addListener('focus', () => {
      getUser();
    });

    return() => {
      unsubscribe;
    }
  }, [navigation]);

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
      fontSize: 23,
      color: colors[getColorScheme()].font.primary,
      marginBottom: 10,
      alignSelf: "center",
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
    <SafeAreaView style={styles.container}>

      <Text style={styles.title} >Settings</Text>

      <Image style={styles.profilePic} source={profilePic ? {uri: profilePic} : require('../../../assets/profile.jpg')} />

      <TouchableOpacity onPress={chooseProfilePic}>
        <Text style={[styles.text, styles.edit]} >Edit</Text>
      </TouchableOpacity>


      <TouchableOpacity>
        <Text style={styles.name} >{user?.name}</Text>
      </TouchableOpacity>

      <Text style={[styles.text, styles.userId]} >@{user?.userName}</Text>

        <View style={styles.settings} >
          <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
            <View style={styles.element} >
              <Ionicons name="ios-settings" style={styles.icon} />
              <Text style={styles.text} >Edit profile</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} ></View>
          
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
    </SafeAreaView>
  );
};
