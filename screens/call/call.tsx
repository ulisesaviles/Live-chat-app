// React native imports
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Theme
import colors from "../../config/colors";
import { CallStates, ColorSchemeType, InCallOptions } from "../../types";

// User queries
import * as UserQueries from "../../db/users";

// Components
import { CallOptions } from './callOptions';
import { CallInfo } from './components/callInfo';

// Default react component
export default ({route, navigation}: any) => {
  // Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const [callState, setCallState] = useState(route.params.callState);
  const [quitCallReady, setQuitCall] = useState(false);

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
  const onPressOption = (optionKey: InCallOptions) => {
    if (optionKey === InCallOptions.END_CALL) {

      setCallState(CallStates.CALL_ENDED);

      setTimeout(() => {
        setQuitCall(true);
      }, 1000);
    }
  }

  // On refresh
  useEffect(() => {
    if (firstLoad) {
      handleFirstLoad();
    }
    if (quitCallReady) {
      navigation.goBack();
    }
  }, [quitCallReady]);

  // Styles
  const styles = StyleSheet.create({
    pictureBackgroundBlur: {
      flex: 1,
      justifyContent: 'center',
    },
    backgroundOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      alignItems: 'center'
    },
    callInfo: {
      paddingTop: 60,
      alignItems: 'center'
    },
    callEndedText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors['dark'].font.primary
    },
    incomingCallText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors['dark'].font.primary
    }
  });

  // React component
  return (
    <>
      
      {/* {WAITING FOR ANSWER OR CALL ENDED} */}
      {
        (callState === CallStates.WAITING || callState === CallStates.CALL_ENDED)
        &&
        <ImageBackground
          source={{uri: 'https://shotkit.com/wp-content/uploads/2021/06/cool-profile-pic-matheus-ferrero.jpeg'}}
          resizeMode="cover"
          style={styles.pictureBackgroundBlur}
          blurRadius={8}
        >
          <View style={styles.backgroundOverlay} >
            <View style={styles.callInfo} >
              <CallInfo callTime="00:00" profilePictureUrl='https://shotkit.com/wp-content/uploads/2021/06/cool-profile-pic-matheus-ferrero.jpeg' />
             {
               callState === CallStates.CALL_ENDED
               &&
               <Text style={styles.callEndedText} >Call ended</Text>
             }
            </View>
          </View>
        </ImageBackground>
      }

      {/* {WAITING FOR ANSWER OR CALL ENDED} */}
      {
        callState === CallStates.INCOMING_CALL
        &&
        <ImageBackground
          source={{uri: 'https://shotkit.com/wp-content/uploads/2021/06/cool-profile-pic-matheus-ferrero.jpeg'}}
          resizeMode="cover"
          style={styles.pictureBackgroundBlur}
          blurRadius={8}
        >
          <View style={styles.backgroundOverlay} >
            <View style={styles.callInfo} >
              <CallInfo callTime="" profilePictureUrl='https://shotkit.com/wp-content/uploads/2021/06/cool-profile-pic-matheus-ferrero.jpeg' />
              <Text style={styles.incomingCallText} >Kalia Velarde</Text>
            </View>
          </View>
        </ImageBackground>
      }

      {/* {ON CALL} */}
      {

      }

      {/* {CALL OPTIONS INSIDE CALL (ANY STATE)} */}
      {
        callState !== CallStates.CALL_ENDED
        &&
        <CallOptions onPressOption={onPressOption} incomingCall={callState === CallStates.INCOMING_CALL} />
      }
    </>
  );
};
