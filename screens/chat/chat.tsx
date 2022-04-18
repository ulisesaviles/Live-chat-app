// React native imports
import { useEffect, useState } from "react";
import {
  Text,
  View,
  Appearance,
  useColorScheme,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList
} from "react-native";

// Theme
import colors from "../../config/colors";
import { CallStates, ColorSchemeType } from "../../types";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";

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


//Message component

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
    const user = await getData('user', true);
    setMyUser(user);
    await getMessages();
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

  // On refresh
  useEffect(() => {
    if (firstLoad) {
      handleFirstLoad();
    }

    return () => (setSubscription(false));
  }, []);

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
            <View style={styles.flexRow} >
              <Image style={styles.headerImage} source={chat.user.pictureUrl ? {uri: chat.user.pictureUrl} : require('../../assets/profile.jpg')} />
              <Text style={styles.title} >{chat.user.name}</Text>
            </View>
          </View>
          <View style={styles.flexRow} >
            <TouchableOpacity onPress={() => navigation.navigate('Call', {callState: CallStates.WAITING})} >
              <View style={styles.gradientBtn}>
                <LinearGradient
                  colors={colors[getColorScheme()].gradients.main}
                  style={{paddingVertical: 6, paddingHorizontal: 7,}}
                >
                  <View>
                    <Ionicons name="ios-call" style={[styles.icon, styles.callIconSize]} />
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
            <MaterialIcons name="more-vert" style={styles.icon} />
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.chat}>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          inverted
          data={messages}
          renderItem={({ item }) => <MessageComponent key={item.timestamp} onPressImage={setSelectedPicUrl} message={item} userId={myUser.userId} profilePictureUrl={chat.user.userId === item.senderId ? chat.user.pictureUrl : myUser?.pictureUrl} />}
          keyExtractor={(message: any, index: number) => index.toString()}
        />
        <InputBox userId={myUser?.userId} onSendMessage={(message: any) => subscription && onNewMessage(message)}  />
      </View>
    </>
  );
};
