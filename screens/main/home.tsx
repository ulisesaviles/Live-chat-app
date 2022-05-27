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
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Expo imports
import { BlurView } from "expo-blur";

// Theme
import colors from "../../config/colors";

// Queries
import * as UserQueries from "../../db/users";
import * as ChatQueries from "../../db/chats";

// Components
import UserDisplayer from "../../components/userDisplayer";
import { Input } from "../../components/input";

// Interfaces
import { User } from "../../interfaces";
import { getData, setData } from "../../config/asyncStorage";

// Types
import { CallStates, ColorSchemeType, ConversationForHome } from "../../types";
import { getCallCollectionRef } from "../../db/call";
import { onSnapshot } from "@firebase/firestore";

// Default react component
export default () => {
  // Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const navigation = useNavigation<any>();
  const [chats, setChats]: [ConversationForHome[], any] = useState(null);
  const [searchResults, setSearchResults]: [ConversationForHome[], any] =
    useState(null);
  const [input, setInput]: [string, any] = useState("");
  const dimensions = {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
  };

  // Helpers
  const getAllChats = async (
    userId: string
  ): Promise<ConversationForHome[]> => {
    const chats: ConversationForHome[] = await ChatQueries.getAllChats(userId);
    setSearchResults(chats);
    setChats(chats);
    await setData(chats, "chats");
    return chats;
  };

  const getColorScheme = () => {
    let tempColorScheme: ColorSchemeType = "light";
    if (colorScheme === "dark") tempColorScheme = "dark";
    return tempColorScheme;
  };

  const getConversations = async () => {
    // Get user
    const user: User = (await getData("user", true))!;

    // Get all chats
    const chats = await getAllChats(user.userId!);

    // Set chats listener
    UserQueries.setUserDocListener(user.userId!, async (updatedUser) => {
      setData(updatedUser, "user");

      // Check if friend was removed
      if (updatedUser.chatsIds?.length! < chats.length) {
        for (let i = 0; i < chats.length; i++) {
          const chatId = chats[i].chatId;
          if (!updatedUser.chatsIds?.includes(chatId!)) {
            let tempChats = [...chats];
            tempChats.splice(i, 1);
            setSearchResults(tempChats);
            setChats(tempChats);
            await setData(tempChats, "chats");
            break;
          }
        }
      }

      // Check if friend was added
      if (updatedUser.chatsIds?.length! > chats.length) {
        // Get all chats
        await getAllChats(user.userId!);
      }

      updatedUser.chatsIds?.forEach(async (chatId) => {
        // Set listeners in each conversation
        await ChatQueries.setChatCollectionListener(
          chatId,
          user.userId!,
          async (newChat) => {
            // Get chats
            const chats: ConversationForHome[] = await getData("chats", true);
            let conversations: ConversationForHome[];
            if (chats === null) conversations = [];
            else conversations = [...chats];

            // Merge conversations arr with new conversation
            if (conversations.length === 0) conversations = [newChat];
            else {
              for (let i = 0; i < conversations.length; i++) {
                const chat = conversations[i];
                if (chat.chatId === newChat.chatId) conversations[i] = newChat;
              }
            }

            // Order them by last message
            conversations.sort((a, b) => {
              if (!a.lastMessage) return -1;
              else if (!b.lastMessage) return 1;
              return b.lastMessage.timestamp - a.lastMessage.timestamp;
            });

            // Set the values
            setInput("");
            setSearchResults(conversations);
            setChats(conversations);
            setData(conversations, "chats");
          }
        );
      });
    });
  };

  const handleFirstLoad = () => {
    setFirstLoad(false);
    Appearance.addChangeListener(() => {
      setColorScheme(Appearance.getColorScheme());
    });
    getConversations();
  };

  const handleInputchange = (value: string) => {
    // Set input
    setInput(value);

    // Perform search
    value = value.trim().toLowerCase();
    let tempChats = [...chats];
    let tempSearchResults: ConversationForHome[] = [];
    for (let i = 0; i < tempChats.length; i++) {
      const user = tempChats[i].user;
      if (
        user.name?.substring(0, value.length).toLowerCase() === value ||
        user.userName?.substring(0, value.length).toLowerCase() === value
      )
        tempSearchResults.push(tempChats[i]);
    }

    // Set values
    setSearchResults(tempSearchResults);
  };

  const timestampToHour = (timestamp: number): string => {
    const date = new Date(timestamp);
    let hours: string | number = date.getHours();
    let time = "am";
    if (hours > 12) {
      hours = hours - 12;
      time = "pm";
    } else if (hours === 0) {
      hours = "00";
    }
    let minutes = date.getMinutes().toString();
    if (minutes === "0") minutes = "00";
    return `${hours}:${minutes} ${time}`;
  };

  

  // On refresh
  useEffect(() => {
    if (firstLoad) {
      handleFirstLoad();
    }
    const callCollectionRef = getCallCollectionRef();

    const user = getData('user', true);

    // Set a listener on the calls collection and check if a new doc containing user's id is added
    user.then((userData: any) => {
      onSnapshot(callCollectionRef, (snapshot) => {
        snapshot.docChanges().forEach( async (change) => {
          if (change.doc.id.includes(`_${userData!.userId}`) && change.type === 'added') {

            //Get remote user data
            const remoteUserId = change.doc.id.split('_')[0];

            const remoteUser = await UserQueries.getUserDoc(remoteUserId);

            // Trigger call incoming
            navigation.navigate("Call", {callState: CallStates.INCOMING_CALL, user: remoteUser});
          }
        })
      });
    });


  }, []);

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[getColorScheme()].background,
    },
    header: {
      alignItems: "center",
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
      paddingTop: 5,
    },
    invisibleFooter: {
      width: "100%",
      height: 100,
    },
    invisibleHeader: {
      width: "100%",
      height: 150,
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
    chatsContainer: {
      width: "100%",
      flex: 1,
    },
  });

  // React component
  return (
    <View style={styles.container}>
      {/* Map users */}
      <>
        {chats === null ? (
          // Loading
          <View style={styles.loadingContainer}>
            <Text style={styles.loading}>Loading chats...</Text>
          </View>
        ) : chats?.length === 0 ? (
          // No users
          <View style={styles.loadingContainer}>
            <Text style={styles.loading}>
              Add a new friend to start chatting🤠
            </Text>
          </View>
        ) : searchResults?.length === 0 ? (
          // No users
          <View style={styles.loadingContainer}>
            <Text style={styles.loading}>No chat matches your search😑</Text>
          </View>
        ) : (
          // Users
          <TouchableWithoutFeedback
            style={styles.chatsContainer}
            onPress={Keyboard.dismiss}
          >
            <ScrollView>
              <View style={styles.invisibleHeader} />
              {
                searchResults.map((chat) => (
                  <View key={chat.chatId}>
                    <UserDisplayer
                      user={chat.user}
                      onPress={() => navigation.navigate("Chat", chat)}
                      type="withLastMessage"
                      lastMessage={
                        chat.lastMessage
                          ? {
                              hour: timestampToHour(chat.lastMessage.timestamp),
                              message:
                                chat.lastMessage.type === "img"
                                  ? "Img"
                                  : chat.lastMessage.text!,
                              senderId: chat.lastMessage.senderId,
                            }
                          : undefined
                      }
                    />
                    {searchResults.length - 1 ===
                    searchResults.indexOf(chat) ? null : (
                      <View style={styles.separator} />
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
        <SafeAreaView style={styles.header}>
          {/* Title section */}
          <View style={styles.headerTopSectionContainer}>
            {/* Title */}
            <Text style={styles.title}>Chats</Text>
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
        </SafeAreaView>
      </BlurView>
    </View>
  );
};
