import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Image, Appearance, StyleSheet, TouchableWithoutFeedback } from "react-native";
import colors from "../../config/colors";
import { Message } from "../../interfaces";

const getColorScheme = () => {
  return Appearance.getColorScheme() || 'dark';
};

const styles = StyleSheet.create({
  messageWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%'
  },

  messageSender: {
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 15,
    backgroundColor: colors[getColorScheme()].input.background,
    maxWidth: '80%'
  },
  
  messageMine: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 2,
    backgroundColor: colors[getColorScheme()].input.background,
    maxWidth: '80%',
    overflow: "hidden"
  },
  text: {
    fontSize: 16,
    color: colors[getColorScheme()].font.primary,
    flexWrap: 'wrap'
  },
  image: {
    borderRadius: 15,
    height: 200,
    width: 200,
    zIndex: 3,
  },
  profilePic: {
    borderRadius: 100,
    width: 32,
    height: 32,
  }
})

interface MessageProps {
  message: Message;
  userId: string;
  profilePictureUrl?: string;
  onPressImage: any;
}
export const MessageComponent = ({message, userId, profilePictureUrl, onPressImage }: MessageProps) => {
  const senderIsNotSelf = userId !== message.senderId;

  return(
    <View style={{ marginBottom: 20}}>
    {
      senderIsNotSelf
      ?
      <View style={[styles.messageWrap, {justifyContent: 'flex-start'}]}>
        <Image style={[styles.profilePic, {marginRight: 8}]} source={profilePictureUrl ? {uri: profilePictureUrl} : require('../../assets/profile.jpg')} />
        {
          message.type == 'txt'
          ?
          <View style={styles.messageSender} >
            <Text style={styles.text} >{message.text}</Text>
          </View>
          :
          <TouchableWithoutFeedback onPress={() => onPressImage(message.pictureUrl)} style={{overflow: 'hidden'}}>
            <Image resizeMode="cover" style={styles.image} source={{uri: message.pictureUrl}} />
          </TouchableWithoutFeedback>
        }
      </View>
      :
      <View style={[styles.messageWrap, {justifyContent: 'flex-end'}]}>
        {
          message.type == 'txt'
          ?
          <View style={styles.messageMine}>
            <LinearGradient
              colors={colors[getColorScheme()].gradients.main}
              style={[{padding: 10}]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={{flex: 1}} >
                <Text style={[styles.text, {textAlign: 'right', color: colors['dark'].font.primary}]} >{message.text}</Text>
              </View>
            </LinearGradient>
          </View>
          :
          <TouchableWithoutFeedback onPress={() => onPressImage(message.pictureUrl)} style={{overflow: 'hidden'}}>
            <Image resizeMode="cover" style={styles.image} source={{uri: message.pictureUrl}} />
          </TouchableWithoutFeedback>
        }
        <Image style={[styles.profilePic, {marginLeft: 8}]} source={profilePictureUrl ? {uri: profilePictureUrl} : require('../../assets/profile.jpg')} />
      </View>
    }
    </View>
  )
}