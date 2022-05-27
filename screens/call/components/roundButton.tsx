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
    color: getColorScheme() === 'dark' ? colors[getColorScheme()].background : colors[getColorScheme()].font.primary
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
            style={{paddingHorizontal: 14, paddingVertical: 12, }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name='ios-call' style={[styles.icon, {color: getColorScheme() === 'dark' ? colors[getColorScheme()].font.primary : colors[getColorScheme()].background}]} />
          </LinearGradient>
        </View>

        :

        name === InCallOptions.VIDEO

         ?

        <View style={[styles.button, isOn &&  {paddingHorizontal: 0, paddingVertical: 0}]}>
          {
            isOn

            ?

            <LinearGradient
              colors={colors[getColorScheme()].gradients.main}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Ionicons name='ios-videocam' style={[styles.icon, {color: getColorScheme() === 'dark' ? colors[getColorScheme()].font.primary : colors[getColorScheme()].background}]} />
            </LinearGradient>

            :

            <Ionicons name='ios-videocam' style={styles.icon} />
          }
        </View>

        :

        name === InCallOptions.AUDIO
        &&
        <View style={[styles.button, !isOn &&  {paddingHorizontal: 0, paddingVertical: 0}]}>
          {
            !isOn

            ?

            <LinearGradient
              colors={colors[getColorScheme()].gradients.main}
              style={{paddingHorizontal: 14, paddingVertical: 12}}
            >
              <Ionicons name='mic-off' style={[styles.icon, {color: getColorScheme() === 'dark' ? colors[getColorScheme()].font.primary : colors[getColorScheme()].background}]} />
            </LinearGradient>
            
            :

            <Ionicons name='mic' style={styles.icon} />
          }
        </View>
      }
    </TouchableOpacity>
  )
}