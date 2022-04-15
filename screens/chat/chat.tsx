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
import { ColorSchemeType } from "../../types";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";

// Icons
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

//Components
import { MessageComponent } from "./message";
import { InputBox } from "./inputBox";
import { PictureModal } from "./pictureModal";

//Interfaces
import { Message } from "../../interfaces";
import { useNavigation } from "@react-navigation/native";


//Message component

// Default react component
export default () => {
  // Constants
  const navigation = useNavigation<any>();
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const [selectedPicUrl, setSelectedPicUrl] = useState('');
  const [messages, setMessages]: any[] = useState([
    {
      id: '111',
      type: 'txt',
      text: 'Lorem ipsum',
      senderId: '1L8oYZ1RpVS0Zw9lmL6ZOjQeeLO2'
    },
    {
      id: '222',
      type: 'txt',
      text: 'Lorem ipsum',
      senderId: '1L8oYZ1RpVS0Zw9lmL6ZOjQeeLO2'
    },
    {
      id: '333',
      type: 'txt',
      text: 'Lorem ipsumip sumi ps umipsumipsumipsum ipsu mipsum ipsumi mipsum ',
      senderId: '0DiTdAyzaVdZ3C9jay5HtIwAZnn1'
    },
  ]);

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
  const onNewMessage = (message: Message) => {
    setMessages([message, ...messages]);
  };

  // On refresh
  useEffect(() => {
    if (firstLoad) {
      handleFirstLoad();
    }
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
            <View style={styles.flexRow} >
              <Image style={styles.headerImage} source={{uri: 'https://shotkit.com/wp-content/uploads/2021/06/cool-profile-pic-matheus-ferrero.jpeg'}} />
              <Text style={styles.title} >Kalia Velarde</Text>
            </View>
          </View>
          <View style={styles.flexRow} >
            <TouchableOpacity onPress={() => navigation.navigate('Call')} >
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
          inverted
          data={messages}
          renderItem={({ item }) => <MessageComponent onPressImage={setSelectedPicUrl} message={item} userId={'0DiTdAyzaVdZ3C9jay5HtIwAZnn1'} profilePictureUrl={'https://shotkit.com/wp-content/uploads/2021/06/cool-profile-pic-matheus-ferrero.jpeg'} />}
          keyExtractor={(message: any) => message.id}
        />
        <InputBox userId="0DiTdAyzaVdZ3C9jay5HtIwAZnn1" onSendMessage={onNewMessage}  />
      </View>
    </>
  );
};
