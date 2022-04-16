// React native imports
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
  Dimensions,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
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
import { Input } from "../../components/input";

// Interfaces
import { User } from "../../interfaces";
import { getData } from "../../config/asyncStorage";

// Default react component
export default () => {
  // Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const navigation = useNavigation<any>();
  const [user, setUser]: [User, any] = useState(null);
  const [users, setUsers]: [User[], any] = useState(null);
  const [searchResults, setSearchResults]: [User[], any] = useState(null);
  const [input, setInput]: [string, any] = useState("");
  const dimensions = {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
  };
  const [selectedUser, setSelectedUser]: {
    id: null | string;
    state: null | string;
  } = useState({
    id: null,
    state: null,
  });

  // Helpers
  const getColorScheme = () => {
    let tempColorScheme: ColorSchemeType = "light";
    if (colorScheme === "dark") tempColorScheme = "dark";
    return tempColorScheme;
  };

  const getUsers = async () => {
    // Get user
    const user: User = (await getData("user", true))!;
    setUser(user);

    // Get users
    const users = await UserQueries.getAllUsers();

    // Set them
    setSearchResults(users);
    setUsers(users);
  };

  const handleFirstLoad = () => {
    setFirstLoad(false);
    Appearance.addChangeListener(() => {
      setColorScheme(Appearance.getColorScheme());
    });
    getUsers();
  };

  const handleInputchange = (value: string) => {
    // Set input
    setInput(value);

    // Perform search
    value = value.trim().toLowerCase();
    let tempUsers = [...users];
    let tempSearchResults: User[] = [];
    for (let i = 0; i < tempUsers.length; i++) {
      const user = tempUsers[i];
      if (
        user.name?.substring(0, value.length).toLowerCase() === value ||
        user.userName?.substring(0, value.length).toLowerCase() === value
      )
        tempSearchResults.push(user);
    }

    // Set values
    setSearchResults(tempSearchResults);
  };

  const sendRequest = async (userId: string) => {
    setSelectedUser({
      id: userId,
      state: "Sending...",
    });

    await UserQueries.sendFriendRequest(userId, user.userId!);

    let tempUsers: User[] = [...searchResults];
    for (let i = 0; i < tempUsers.length; i++) {
      const user_ = tempUsers[i];
      if (user_.userId === userId)
        tempUsers[i] = {
          ...user_,
          state: "Sent",
        };
    }
    setSearchResults(tempUsers);
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
      left: dimensions.width * 0.05,
      alignSelf: "flex-start",
      top: 20,
    },
    headerContainer: {
      position: "absolute",
      top: 0,
      width: dimensions.width,
      flex: 1,
      paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
    },
    headerTopSectionContainer: {
      width: "100%",
      paddingTop: 20,
    },
    invisibleFooter: {
      width: "100%",
      height: 57,
    },
    invisibleHeader: {
      width: "100%",
      height: 120,
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
        {users === null ? (
          // Loading
          <View style={styles.loadingContainer}>
            <Text style={styles.loading}>Loading users...</Text>
          </View>
        ) : users?.length === 0 ? (
          // No users
          <View style={styles.loadingContainer}>
            <Text style={styles.loading}>There are no new users yet😒</Text>
          </View>
        ) : searchResults?.length === 0 ? (
          // No users
          <View style={styles.loadingContainer}>
            <Text style={styles.loading}>No user matches your search😑</Text>
          </View>
        ) : (
          // Users
          <TouchableWithoutFeedback
            style={styles.usersContainer}
            onPress={Keyboard.dismiss}
          >
            <ScrollView>
              <View style={styles.invisibleHeader} />
              {
                searchResults.map((user_) => (
                  <View key={user_.userId}>
                    {user_.userId === user.userId ||
                    user.friendsIds?.includes(user_.userId!) ? null : (
                      <>
                        <UserDisplayer
                          user={user_}
                          onPress={() => sendRequest(user_.userId!)}
                          type="onlyName"
                          state={
                            user_.state != null && user_.state != ""
                              ? user_.state
                              : selectedUser.id === user_.userId
                              ? selectedUser.state
                              : null
                          }
                        />
                        {searchResults.indexOf(user_) ===
                        searchResults.length - 1 ? null : (
                          <View style={styles.separator} />
                        )}
                      </>
                    )}
                  </View>
                ))!
              }
              <View style={styles.invisibleFooter} />
            </ScrollView>
          </TouchableWithoutFeedback>
        )}
      </>

      {/* Header */}
      <BlurView
        style={styles.headerContainer}
        tint={getColorScheme()}
        intensity={100}
      >
        <View style={styles.header}>
          {/* Title section */}
          <View style={styles.headerTopSectionContainer}>
            {/* Title */}
            <Text style={styles.title}>Add friend</Text>
            {/* Add btn */}
            <View style={styles.headerBtnContainer}>
              <Button
                onPress={() => navigation.goBack()}
                type="gradient"
                value="Close"
                small
              />
            </View>
          </View>

          {/* Input */}
          <View style={{ marginBottom: -20, marginTop: -20 }}>
            <Input
              label=""
              value={input}
              onChangeText={(value) => handleInputchange(value)}
              placeholder="Search"
              type="username"
            />
          </View>
        </View>
      </BlurView>
    </View>
  );
};
