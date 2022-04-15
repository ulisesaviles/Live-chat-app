import { Appearance, Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import { BlurView } from "expo-blur";


import colors from '../../config/colors';

import { InCallOptions } from '../../types';

// Components
import { RoundButton } from './components/roundButton';


const getColorScheme = () => {
  return Appearance.getColorScheme() || 'dark';
};

const styles = StyleSheet.create({
  options: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: colors[getColorScheme()].background,
    padding: 40,
    position: 'absolute',
    bottom: 0,
    width: (Dimensions.get('screen').width)
  }
});

export const CallOptions = ({onPressOption, incomingCall}:{onPressOption: any, incomingCall?: boolean}): JSX.Element => {


  return(
    <BlurView
      tint={getColorScheme()}
      intensity={100}
      style={{
        position: "absolute",
        bottom: 0,
        flex: 1,
        width: "100%",
      }}
    >
      <SafeAreaView >
        <View style={styles.options}>
          {
            !incomingCall
            ?
            <>
              <RoundButton name={InCallOptions.VIDEO} onPress={() => onPressOption(InCallOptions.VIDEO)} />
              <RoundButton name={InCallOptions.AUDIO} onPress={() => onPressOption(InCallOptions.AUDIO)} />
              <RoundButton name={InCallOptions.SWAP} onPress={() => onPressOption(InCallOptions.SWAP)} />
              <RoundButton name={InCallOptions.END_CALL} onPress={() => onPressOption(InCallOptions.END_CALL)} />
            </>
            :
            <>
              <RoundButton name={InCallOptions.END_CALL} onPress={() => onPressOption(InCallOptions.END_CALL)} />
              <RoundButton name={InCallOptions.ANSWER_CALL} onPress={() => onPressOption(InCallOptions.ANSWER_CALL)} />
            </>
          }
        </View>
      </SafeAreaView>
    </BlurView>
  )
}