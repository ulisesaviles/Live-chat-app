import { useEffect, useState } from "react";
import { 
  View,
  Modal,
  Image,
  StyleSheet,
  Appearance,
  Dimensions,
  SafeAreaView, 
  Text,
  TouchableOpacity,
  useColorScheme } from "react-native";

//User queries
import * as UserQueries from '../../db/users'; 

//Icons
import { Ionicons } from '@expo/vector-icons';

import colors from "../../config/colors";
import { ColorSchemeType } from "../../types";
import { User } from "../../interfaces";

export const ProfileModal = ({route}:any): JSX.Element => {
  // Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const [user, setUser]: User | any = useState({});
  const userId = route.params.userId;

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

  //Functions
  const getUser = async () => {
    try {
      const userDoc = await UserQueries.getUserDoc(userId);
      setUser(userDoc);
    }
    catch(error) {
      console.log(error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[getColorScheme()].background,
      borderRadius: 10,
      padding: 10,
      elevation: 1
    },
    image: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      borderRadius: 10,
      backgroundColor: colors[getColorScheme()].card,
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
    },
    danger : {
      color: colors[getColorScheme()].font.danger
    }
  });

  // On refresh
  useEffect(() => {
    if (firstLoad) {
      handleFirstLoad();
    }
    if (userId !== '') {
      getUser();
    }
  }, [userId]);

  return(
      <>
      {
        userId !== ''
        &&
        <SafeAreaView style={styles.container}>
          <View style={{padding: 20, flex: 1, width: '100%', alignItems: 'center'}}>
            <Image style={styles.profilePic} source={user.pictureUrl ? {uri: user.pictureUrl} : require('../../assets/profile.jpg')} />
            <TouchableOpacity>
              <Text style={styles.name} >{user?.name}</Text>
            </TouchableOpacity>

            <Text style={[styles.text, styles.userId]} >@{user?.userName}</Text>

            <View style={styles.settings} >    
              <TouchableOpacity>
                <View style={styles.element} >
                  <Ionicons name="ios-remove-circle" style={[styles.icon, styles.danger]} />
                  <Text style={[styles.text, styles.danger]} >Remove friend</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      }
      </>
  )
}