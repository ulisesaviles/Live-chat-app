// React native imports
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Expo imports
import { BlurView } from "expo-blur";

// Theme
import colors from "../../config/colors";
import { ColorSchemeType } from "../../types";

// User queries
import * as UserQueries from "../../db/users";

// Components
import { Button } from "../../components/button";
import UserDisplayer from "../../components/userDisplayer";

// Interfaces
import { User } from "../../interfaces";
import { getData, setData } from "../../config/asyncStorage";

// Default react component
export default () => {
  // Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const navigation = useNavigation<any>();
  type tabs = "friends" | "requests";
  const availableTabs: tabs[] = ["friends", "requests"];
  const [selectedTab, setSelectedTab]: [tabs, any] = useState(availableTabs[0]);
  const [user, setUser]: [User | null, any] = useState(null);
  const [friends, setFriends]: [User[], any] = useState(null);
  const [requests, setRequests]: [User[], any] = useState(null);
  const dimensions = {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
  };

  // Helpers
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

  const getColorScheme = () => {
    let tempColorScheme: ColorSchemeType = "light";
    if (colorScheme === "dark") tempColorScheme = "dark";
    return tempColorScheme;
  };

  const getUsers = async () => {
    // Get user
    const user: User = (await getData("user", true))!;

    // SetListener
    UserQueries.setUserDocListener(user.userId!, async (user) => {
      // Set friends
      let friends: User[] = [];
      for (let i = 0; i < user.friendsIds!.length; i++) {
        const id = user.friendsIds![i];
        friends.push(await UserQueries.getUserDoc(id));
      }
      setFriends(friends);

      // Set requests
      let requests: User[] = [];
      for (let i = 0; i < user.requests!.length; i++) {
        const id = user.requests![i];
        requests.push(await UserQueries.getUserDoc(id));
      }
      setRequests(requests);

      // Update user
      await setData(user, "user");
    });
  };

  const handleFirstLoad = () => {
    setFirstLoad(false);
    Appearance.addChangeListener(() => {
      setColorScheme(Appearance.getColorScheme());
    });
    getUsers();
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
      flex: 1,
      backgroundColor: colors[getColorScheme()].background,
    },
    header: {
      alignItems: "center",
    },
    headerBtnContainer: {
      position: "absolute",
      right: dimensions.width * 0.05,
      alignSelf: "flex-end",
      top: 15,
    },
    headerContainer: {
      position: "absolute",
      top: 0,
      width: dimensions.width,
      flex: 1,
      paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
    },
    headerNavContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: "100%",
    },
    headerTopSectionContainer: {
      width: "100%",
      paddingTop: 15,
      marginBottom: 15,
    },
    invisibleFooter: {
      width: "100%",
      height: 57,
    },
    invisibleHeader: {
      width: "100%",
      height: 110,
    },
    loading: {
      color: colors[getColorScheme()].font.secondary,
      textAlign: "center",
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    navItem: {
      fontSize: 17,
      width: dimensions.width / 3,
      marginBottom: 10,
      textAlign: "center",
    },
    navItemSelected: {
      color: colors[colorScheme!].font.accent,
      fontWeight: "600",
    },
    navItemUnselected: {
      color: colors[getColorScheme()].font.secondary,
    },
    navUnderline: {
      width: "100%",
      height: 2,
      borderRadius: 1,
    },
    navUnderlineUnselected: {},
    navUnderlineSelected: {
      backgroundColor: colors[colorScheme!].font.accent,
    },
    separator: {
      width: dimensions.width * 0.9 - 70,
      alignSelf: "flex-end",
      right: dimensions.width * 0.05,
      height: 1,
      backgroundColor: colors[colorScheme!].font.primary,
      opacity: 0.1,
      marginVertical: 5,
    },
    title: {
      fontWeight: "600",
      fontSize: 23,
      color: colors[getColorScheme()].font.primary,
      marginBottom: 10,
      alignSelf: "center",
    },
    usersContainer: {
      width: "100%",
      flex: 1,
    },
  });

  // React component
  return (
    <View style={styles.container}>
      {/* Map users */}
      <>
        {friends === null || requests === null ? (
          // Loading
          <View style={styles.loadingContainer}>
            <Text style={styles.loading}>Loading...</Text>
          </View>
        ) : selectedTab === "friends" && friends.length === 0 ? (
          // No friends
          <View style={styles.loadingContainer}>
            <Text style={styles.loading}>
              You have no friends yet{"\n"}Press "Add" to add a friend!🤠
            </Text>
          </View>
        ) : selectedTab === "requests" && requests.length === 0 ? (
          // No requests
          <View style={styles.loadingContainer}>
            <Text style={styles.loading}>
              You have no requests yet{"\n"}Press "Add" to send a request to a
              friend!🤪
            </Text>
          </View>
        ) : (
          // Users
          <SafeAreaView style={styles.usersContainer}>
            <ScrollView>
              <View style={styles.invisibleHeader} />
              {selectedTab === "friends"
                ? friends.map((user) => (
                    <View key={user.userId}>
                      <UserDisplayer user={user} />
                      {friends.indexOf(user) === friends.length - 1 ? null : (
                        <View style={styles.separator} />
                      )}
                    </View>
                  ))
                : requests.map((user) => (
                    <View key={user.userId}>
                      <UserDisplayer user={user} />
                      {requests.indexOf(user) === requests.length - 1 ? null : (
                        <View style={styles.separator} />
                      )}
                    </View>
                  ))}
              <View style={styles.invisibleFooter} />
            </ScrollView>
          </SafeAreaView>
        )}
      </>

      {/* Header */}
      <BlurView
        style={styles.headerContainer}
        tint={getColorScheme()}
        intensity={100}
      >
        <SafeAreaView style={styles.header}>
          {/* Title section */}
          <View style={styles.headerTopSectionContainer}>
            {/* Title */}
            <Text style={styles.title}>People</Text>
            {/* Add btn */}
            <View style={styles.headerBtnContainer}>
              <Button
                onPress={() => navigation.navigate("AddFriend")}
                type="gradient"
                value="Add"
                small
              />
            </View>
          </View>
          {/* Nav */}
          <View style={styles.headerNavContainer}>
            {availableTabs.map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
                <Text
                  style={[
                    styles.navItem,
                    styles[
                      tab === selectedTab
                        ? "navItemSelected"
                        : "navItemUnselected"
                    ],
                  ]}
                >
                  {capitalize(tab)}
                  {tab === "requests"
                    ? `(${requests === null ? "..." : requests.length})`
                    : null}
                </Text>
                <View
                  style={[
                    styles.navUnderline,
                    styles[
                      tab === selectedTab
                        ? "navUnderlineSelected"
                        : "navUnderlineUnselected"
                    ],
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </BlurView>
    </View>
  );
};
