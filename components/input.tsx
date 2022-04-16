
import { useEffect, useState } from "react";
import { main
  Dimensions,
  StyleSheet,
  View,
  Text,
  TextInput,
  Appearance,
} from "react-native";
import colors from "../config/colors";

// Constants
const dimensions = {
  height: Dimensions.get("screen").height,
  width: Dimensions.get("screen").width,
};

interface InputProps {
  type:
    | "none"
    | "URL"
    | "addressCity"
    | "addressCityAndState"
    | "addressState"
    | "countryName"
    | "creditCardNumber"
    | "emailAddress"
    | "familyName"
    | "fullStreetAddress"
    | "givenName"
    | "jobTitle"
    | "location"
    | "middleName"
    | "name"
    | "namePrefix"
    | "nameSuffix"
    | "nickname"
    | "organizationName"
    | "postalCode"
    | "streetAddressLine1"
    | "streetAddressLine2"
    | "sublocality"
    | "telephoneNumber"
    | "username"
    | "password";
  label: string;
  value?: string;
  onChangeText: any;
  placeholder: string;
  secureTextEntry?: boolean;
  noMargin?: boolean;
  customWidth?: any;
}

const Input = (props: InputProps): JSX.Element => {
  // State handlers
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);

  // Styles
  const styles = StyleSheet.create({
    input: {
      backgroundColor: colors[colorScheme!].input.background,
      paddingVertical: 8,
      paddingHorizontal: 10,
      fontSize: 18,
      borderRadius: 10,
      width: "100%",
      color: colors[colorScheme!].font.primary,
    },
    inputContainer: {
      width: dimensions.width * 0.9,
      marginBottom: 30,
    },
    inputTitle: {
      color: colors[colorScheme!].font.secondary,
      fontWeight: "600",
      marginBottom: 10,
      fontSize: 16,
    },
  });

  // Colorscheme change handler
  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      Appearance.addChangeListener(() => {
        setColorScheme(Appearance.getColorScheme());
      });
    }
  });

  return (
    <View style={[styles.inputContainer, props.noMargin && {marginBottom: 0}]}>
      <Text style={styles.inputTitle}>{props.label}</Text>
      <TextInput
        style={[styles.input, props.customWidth && {width: props.customWidth}]}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={colors[colorScheme!].input.placeholder}
        textContentType={props.type}
        clearButtonMode="while-editing"
        secureTextEntry={props.secureTextEntry}
      />
    </View>
  );
};

export { Input };
