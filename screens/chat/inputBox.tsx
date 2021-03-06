import { 
  View,
  TextInput,
  StyleSheet,
  Appearance,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
} from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';

// Theme
import colors from "../../config/colors";

// Icons
import { Ionicons } from '@expo/vector-icons';
import { Message } from "../../interfaces";
import { ColorSchemeType } from "../../types";

export const InputBox = ({userId, onSendMessage}:{userId: string, onSendMessage: any}): JSX.Element => {
  // Constants
  const [keyboardOn, toggleKeyboard] = useState(false);
  const [messageText, setText] = useState('');
  const [subscription, setSubscription] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [colorScheme, setColorScheme] = useState(useColorScheme());

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

  //Events
  Keyboard.addListener('keyboardWillShow', () => {
    toggleKeyboard(true);
  })
  Keyboard.addListener('keyboardWillHide', () => {
    toggleKeyboard(false);
  })

  // Functions
  const choosePics = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1
    });


    if (!res.cancelled) {
      const message: Message = {
        id: 5,
        type: 'img',
        pictureUrl: res.uri,
        senderId: userId
      };

      onSendMessage(message);
    }
    setText('');
  }

  const onSendText = () => {
    if (messageText) {
      const message: Message = {
        id: 5,
        type: 'txt',
        text: messageText,
        senderId: userId
      };
      onSendMessage(message);
      setText('');
    }
  }

  // On refresh
  useEffect(() => {
    if (firstLoad) {
      handleFirstLoad();
    }

    return () => (setSubscription(false));
  }, []);

  const styles = StyleSheet.create({
    inputBox: {
      backgroundColor: colors[getColorScheme()].input.background,
      paddingVertical: 8,
      paddingHorizontal: 10,
      fontSize: 18,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems:'center',
      justifyContent: 'space-between',
      marginBottom: 20
    },
    input: {
      flex: 1,
      backgroundColor: colors[getColorScheme()].input.background,
      paddingVertical: 8,
      paddingHorizontal: 10,
      fontSize: 18,
      borderRadius: 10,
      color: colors[getColorScheme()].font.primary,
      maxHeight: 104
    },
  
    button: {
      borderRadius: 100,
      padding: 8,
      backgroundColor: getColorScheme() === 'dark' ? colors[getColorScheme()].card : colors['light'].background,
    },
    icon: {
      fontSize: 16,
      color: colors[getColorScheme()].font.primary
    }
  });

  return(
    <KeyboardAvoidingView behavior="padding" >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
        <View>
          <View style ={[styles.inputBox, {alignItems: 'flex-end'}]} >
            <TouchableOpacity onPress={choosePics}>
              <View style={styles.button} >
                <Ionicons name="ios-image" style={styles.icon} ></Ionicons>
              </View>
            </TouchableOpacity>
            <TextInput
              style={[styles.input]}
              placeholder="say something..."
              multiline
              placeholderTextColor={
                colors[getColorScheme()].input.placeholder
              }
              onChangeText={(value) => subscription && setText(value)}
              value={messageText}
            />
            <TouchableOpacity
              disabled={messageText === ''}
              style={
                [
                  styles.button,
                  {
                    backgroundColor: messageText !== '' ? colors[getColorScheme()].font.accent : colors[getColorScheme()].card 
                  }
                ]
              }
              onPress={onSendText} >
                <Ionicons name="ios-send" style={[styles.icon, messageText !== '' && {color: colors['dark'].font.primary}]} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {
        keyboardOn
        &&
        <View style={{height: 120}} ></View>
      }
    </KeyboardAvoidingView>
  )
}