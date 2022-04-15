import { 
  Dimensions,
  StyleSheet,
  View,
  Text,
  TextInput,
  Appearance
} from "react-native"
import colors from "../config/colors";

// Constants
const dimensions = {
  height: Dimensions.get("screen").height,
  width: Dimensions.get("screen").width,
};

const getColorScheme = () => {
  return Appearance.getColorScheme() || 'dark';
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors[getColorScheme()].input.background,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 18,
    borderRadius: 10,
    width: "100%",
    color: colors[getColorScheme()].font.primary,
  },
  inputContainer: {
    width: dimensions.width * 0.9,
    marginBottom: 30,
  },
  inputTitle: {
    color: colors[getColorScheme()].font.secondary,
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 16,
  },
})

interface InputProps {
  type: 'none'| 'URL' | 'addressCity' | 'addressCityAndState' | 'addressState' | 'countryName' | 'creditCardNumber' | 'emailAddress' | 'familyName' | 'fullStreetAddress' | 'givenName' | 'jobTitle' | 'location' | 'middleName' | 'name' | 'namePrefix' | 'nameSuffix' | 'nickname' | 'organizationName' | 'postalCode' | 'streetAddressLine1' | 'streetAddressLine2' | 'sublocality' | 'telephoneNumber' | 'username' | 'password';
  label: string;
  value?: string;
  onChangeText: any;
  placeholder: string;
  secureTextEntry?: boolean;
  noMargin?: boolean;
  customWidth?: any;
}

const Input = (props: InputProps): JSX.Element => {

  return(
    <View style={[styles.inputContainer, props.noMargin && {marginBottom: 0}]}>
      <Text style={styles.inputTitle}>{props.label}</Text>
      <TextInput
        style={[styles.input, props.customWidth && {width: props.customWidth}]}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={
          colors[getColorScheme()].input.placeholder
        }
        textContentType={props.type}
        clearButtonMode="while-editing"
        secureTextEntry={props.secureTextEntry}
      />
    </View>
    )
}

export {Input}