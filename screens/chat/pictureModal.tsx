import { View, Modal, Image, StyleSheet, Appearance, Dimensions, TouchableWithoutFeedback } from "react-native";
import colors from "../../config/colors";

const getColorScheme = () => {
  return Appearance.getColorScheme() || 'dark';
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors[getColorScheme()].card,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    elevation: 1
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('screen').height * 0.8,
    borderRadius: 10
  }
})

export const PictureModal = ({visible, uri, onCloseModal}:{visible: boolean, uri: string, onCloseModal: any}): JSX.Element => {
  return(
      <View style={styles.modal}>
        <Modal
          animationType="fade"
          transparent
          presentationStyle="overFullScreen"
          visible={visible}
          onRequestClose={onCloseModal}
        >
          <TouchableWithoutFeedback onPress={onCloseModal}>
            <View style={styles.centered} >
              <Image resizeMethod="scale" resizeMode="contain" style={styles.image} source={{uri}}/>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
  )
}