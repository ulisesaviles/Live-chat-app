import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Image, Appearance, StyleSheet } from "react-native";
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
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 2,
    backgroundColor: colors[getColorScheme()].input.background,
    maxWidth: '80%'
  },
  text: {
    fontSize: 14,
    color: colors[getColorScheme()].font.primary,
    flexWrap: 'wrap'
  },
  image: {
    borderRadius: 5,
    width: 'auto',
    height: 'auto'
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
}
export const MessageComponent = ({message, userId, profilePictureUrl }: MessageProps) => {
  const senderIsNotSelf = userId !== message.senderId;

  return(
    <View style={{ marginBottom: 20}}>
    {
      senderIsNotSelf
      ?
      <View style={[styles.messageWrap, {justifyContent: 'flex-start'}]}>
        <Image style={[styles.profilePic, {marginRight: 8}]} source={{uri: profilePictureUrl}} />
        <View style={styles.messageSender} >
          {
            message.type == 'txt'
            ?
            <Text style={styles.text} >{message.text}</Text>
            :
            <Image style={styles.image} source={{uri: message.pictureUrl}} />
          }
        </View>
      </View>
      :
      <View style={[styles.messageWrap, {justifyContent: 'flex-end'}]}>
        <LinearGradient
          colors={colors[getColorScheme()].gradients.main}
          style={styles.messageMine}
        >
          <View >
            {
              message.type == 'txt'
              ?
              <Text style={[styles.text, {textAlign: 'right'}]} >{message.text}</Text>
              :
              <Image style={styles.image} source={{uri: message.pictureUrl}} />
            }
          </View>
        </LinearGradient>
        <Image style={[styles.profilePic, {marginLeft: 8}]} source={{uri: profilePictureUrl}} />
      </View>
    }
    </View>
  )
}