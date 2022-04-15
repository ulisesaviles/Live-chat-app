import { StyleSheet, View, Image, Text } from "react-native";
import colors from "../../../config/colors";

const styles = StyleSheet.create({
  vertical: {
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 128,
    height: 128,
    borderRadius: 100,
    marginBottom: 5
  },
  horizontalProfilePic: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginRight: 5
  },
  callTime: {
    fontSize: 18,
    fontWeight: '600',
    color: colors['dark'].font.primary
  }
})

interface CallInfoProps {
  position?: 'vertical' | 'horizontal';
  profilePictureUrl?: string;
  callTime: string;
}

export const CallInfo = ({position, profilePictureUrl, callTime}: CallInfoProps) => {
  return(
    <View style={position === 'horizontal' ? styles.horizontal : styles.vertical} >
      <Image
        style={position === 'horizontal' ? styles.horizontalProfilePic : styles.profilePic}
        source={{uri: profilePictureUrl}}
      />
      <Text style={styles.callTime} >{callTime}</Text>
    </View>
  );
}