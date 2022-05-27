// React native imports
import { useEffect, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Appearance,
  useColorScheme,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList
} from "react-native";
import ActionSheet from "react-native-actionsheet";

// Theme
import colors from "../../config/colors";
import { CallStates, ColorSchemeType } from "../../types";
import { LinearGradient } from "expo-linear-gradient";

// Icons
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

//Components
import { MessageComponent } from "./message";
import { InputBox } from "./inputBox";
import { PictureModal } from "./pictureModal";

// Chat functions
import * as ChatQueries from '../../db/chats';


//Interfaces
import { Message } from "../../interfaces";
import { useNavigation } from "@react-navigation/native";
import { getData } from "../../config/asyncStorage";

// Default react component
export default ({route}:any) => {
  // Constants
  const navigation = useNavigation<any>();
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const [selectedPicUrl, setSelectedPicUrl] = useState('');
  const [chat, setChat] = useState(route.params);
  const [latestChatSize, setChatSize] = useState(0);
  const [myUser, setMyUser]: any = useState(null);
  const [subscription, setSubscription] = useState(true);

  const [messages, setMessages]: any[] = useState([]);
  const clearChatRef: any = useRef();

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
    getMessages();
  };

  // Functions
  const getMessages = async() => {
    const messages = await ChatQueries.getMessages(chat.chatId);
    setMessages(messages.slice(0, messages.length - 1).reverse());
    setChatSize(messages.length);
  };
  
  const onNewMessage = async (message: Message) => {
    if (subscription) {
      await ChatQueries.sendMessage(chat.chatId, message);
      await getMessages();
    }
  };

  ChatQueries.messagesListener(chat.chatId, (msgs) => {
    if (msgs && messages.length !== 0 && msgs.length > latestChatSize) {
      setChatSize(msgs.length);
      setMessages([...msgs.slice(0, msgs.length).reverse()]);
    }
  });

  const handleClearChat = async(response: number) => {
    enum Actions {
      CLEAR_CHAT = 0,
      CLOSE = 1
    }

    if (response === Actions.CLEAR_CHAT) {
      ChatQueries.clearChat(chat.chatId);
      navigation.goBack();
    }
  };

  const showClearChatActionSheet = () => {
    clearChatRef.current.show();
  }

  const openProfileModal = () => {
    navigation.navigate('FriendProfile', { userId: chat.user.userId });
  };

  // On refresh
  useEffect(() => {
    if (firstLoad) {
      handleFirstLoad();
      getData('user', true).then((userData: any) => setMyUser(userData))
    }

    return () => (setSubscription(false));
  }, []);

  const styles: any = StyleSheet.create({
    chat: {
      flex: 1,
      backgroundColor: colors[getColorScheme()].background,
      padding: 20
    },
    loading: {
      color: colors[getColorScheme()].font.primary,
    },
    title: {
      fontWeight: "600",
      fontSize: 18,
      color: colors[getColorScheme()].font.primary,
    },
  
    areaView: {
      backgroundColor: colors[getColorScheme()].background
    },
  
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingTop: 20,
      paddingLeft: 20,
      paddingRight: 20,
      backgroundColor: colors[getColorScheme()].background
    },
    
    flexRow: {
      flexDirection: "row",
      alignItems: 'center'
    },
    
    headerImage: {
      width: 38,
      height: 38,
      borderRadius: 1000,
      marginRight: 10
    },
    
    icon: {
      fontSize: 28,
      color: colors[getColorScheme()].font.primary
    },
    backIcon: {
      marginRight: 20
    },
    gradientBtn: {
      borderRadius: 20,
      overflow: 'hidden'
    },
    callIconSize: {
      fontSize: 16,
      borderRadius: 100
    },
  });

  // React component
  return (
    <>
      {
        <PictureModal visible={selectedPicUrl !== ''} onCloseModal={() => setSelectedPicUrl('')} uri={selectedPicUrl} />
      }
      <SafeAreaView style={styles.areaView} >
        <View style={styles.header} >
          <View style={styles.flexRow} >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="ios-arrow-back" style={[styles.icon, styles.backIcon]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.flexRow} onPress={openProfileModal} >
              <Image style={styles.headerImage} source={chat.user.pictureUrl ? {uri: chat.user.pictureUrl} : require('../../assets/profile.jpg')} />
              <Text style={styles.title} >{chat.user.name}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flexRow} >
            <TouchableOpacity onPress={() => navigation.navigate('Call', {callState: CallStates.WAITING, user: chat.user})} >
              <View style={styles.gradientBtn}>
                <LinearGradient
                  colors={colors[getColorScheme()].gradients.main}
                  style={{paddingVertical: 6, paddingHorizontal: 7,}}
                >
                  <View>
                    <Ionicons name="ios-call" style={[styles.icon, styles.callIconSize, {color: colors['dark'].font.primary}]} />
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={showClearChatActionSheet}>
              <MaterialIcons name="more-vert" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.chat}>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          inverted
          data={messages}
          renderItem={({ item }) => <MessageComponent key={item.timestamp} onPressImage={setSelectedPicUrl} message={item} userId={myUser?.userId} profilePictureUrl={chat.user.userId === item.senderId ? chat.user.pictureUrl : myUser?.pictureUrl} />}
          keyExtractor={(message: any, index: number) => index.toString()}
        />
        <InputBox userId={myUser?.userId} onSendMessage={(message: any) => subscription && onNewMessage(message)}  />
        <ActionSheet
        ref={clearChatRef}
        title="Do you want to clear this chat for you and your friend?"
        options={["Clear chat", "Close"]}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
        onPress={handleClearChat}
      />
      </View>
    </>
  );
};
