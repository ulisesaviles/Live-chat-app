import { 
  View,
  TextInput,
  StyleSheet,
  Appearance,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  SafeAreaView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';

// Theme
import colors from "../../config/colors";

// Icons
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";

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

export const InputBox = (): JSX.Element => {
  // Constants
  const [keyboardOn, toggleKeyboard] = useState(false);
  // const [maxHeightAchieved, setHeightMaxed] = useState(false);
  const [selectedPicture, setPicture]: any[] = useState(null);

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
      setPicture(res.uri);
    }
  }

  useEffect(() => {
    console.log(selectedPicture);
  }, [selectedPicture]);

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
            />
            <TouchableOpacity style={[styles.button, {backgroundColor: colors[getColorScheme()].font.accent}]} >
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