import { 
  View,
  TextInput,
  StyleSheet,
  Appearance,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';

// Theme
import colors from "../../config/colors";

// Icons
import { Ionicons } from '@expo/vector-icons';
import { Message } from "../../interfaces";

const getColorScheme = () => {
  return Appearance.getColorScheme() || 'dark';
};

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
    backgroundColor: colors[getColorScheme()].card,
  },
  icon: {
    fontSize: 16,
    color: colors[getColorScheme()].font.primary
  }
})

export const InputBox = ({userId, onSendMessage}:{userId: string, onSendMessage: any}): JSX.Element => {
  // Constants
  const [keyboardOn, toggleKeyboard] = useState(false);
  const [messageText, setText] = useState('');

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
    closeKeyboard();
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
      closeKeyboard();
    }
  }

  const closeKeyboard = () => {
    setText('');
    Keyboard.dismiss();
  }

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
              onChangeText={(value) => setText(value)}
              value={messageText}
            />
            <TouchableOpacity
              disabled={messageText === ''}
              style={
                [
                  styles.button,
                  {
                    backgroundColor: messageText !== '' ? colors[getColorScheme()].font.accent : colors[getColorScheme()].font.secondary 
                  }
                ]
              }
              onPress={onSendText} >
                <Ionicons name="ios-send" style={styles.icon} />
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