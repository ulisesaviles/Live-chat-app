import { useState } from "react";
import { 
  Appearance,
  StyleSheet,
  TouchableOpacity ,
  View,
} from "react-native";

//Icons
import { Ionicons } from '@expo/vector-icons';
import colors from "../../../config/colors";
import { LinearGradient } from "expo-linear-gradient";
import { InCallOptions } from "../../../types";

const getColorScheme = () => {
  return Appearance.getColorScheme() || 'dark';
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors[getColorScheme()].card,
    overflow: 'hidden'
  },
  icon: {
    fontSize: 28,
    color: colors[getColorScheme()].font.primary
  },

});



interface RoundButtonProps {
  name: InCallOptions;
  on?: boolean;
  onPress: any;
}

export const RoundButton = ({name, on, onPress}: RoundButtonProps) => {
  //Variables
  const [isOn, setOn] = useState( on ? on : false);

  //Functions
  const onToggle = () => {
    setOn(!isOn);
    onPress();
  }
  
  //React component
  return(
    <TouchableOpacity onPress={onToggle} >
      {
        name === InCallOptions.SWAP
        
        ?

        <View style={styles.button} >
          <Ionicons name='swap-horizontal' style={styles.icon} />
        </View>
        :

        name === InCallOptions.END_CALL || name === InCallOptions.ANSWER_CALL

        ?

        <View style={[styles.button, {paddingHorizontal: 0, paddingVertical: 0}]} >
          <LinearGradient
            colors={
              name === InCallOptions.END_CALL
              ?
              colors[getColorScheme()].gradients.red
              :
              colors[getColorScheme()].gradients.green
            }
            style={{paddingHorizontal: 14, paddingVertical: 12}}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name='ios-call' style={styles.icon} />
          </LinearGradient>
        </View>

        :

        <View style={[styles.button, isOn &&  {paddingHorizontal: 0, paddingVertical: 0}]}>
          {
            name === InCallOptions.VIDEO
            &&
            isOn
            &&
            <LinearGradient
              colors={colors[getColorScheme()].gradients.main}
              style={{paddingHorizontal: 14, paddingVertical: 12}}
            >
              <Ionicons name='ios-videocam' style={styles.icon} />
            </LinearGradient>
            ||
            name === InCallOptions.VIDEO
            &&
            !isOn
            &&
            <Ionicons name='ios-videocam' style={styles.icon} />
          }
          {
            name === InCallOptions.AUDIO
            &&
            isOn
            &&
            <LinearGradient
              colors={colors[getColorScheme()].gradients.main}
              style={{paddingHorizontal: 14, paddingVertical: 12}}
            >
              <Ionicons name='mic-off' style={styles.icon} />
            </LinearGradient>
            ||
            name === InCallOptions.AUDIO
            &&
            !isOn
            &&
            <Ionicons name='mic' style={styles.icon} />
          }
        </View>
      }
    </TouchableOpacity>
  )
}