// React native imports
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { getActionFromState, useNavigation } from "@react-navigation/native";

// Expo imports
import { LinearGradient } from "expo-linear-gradient";

// Theme
import colors from "../../config/colors";
import { ColorSchemeType } from "../../types";

// User queries
import * as UserQueries from "../../db/users";

// Default react component
export default () => {
  // Constants
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [firstLoad, setFirstLoad] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const dimensions = {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
  };

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

  const isAValidEmail = (email: string) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test(email)) {
      return true;
    }
  };

  // Functions
  const signIn = async () => {
    // Start loading
    setLoading(true);

    // Check inputs
    if (!isAValidEmail(email)) {
      Alert.alert("Enter a valid email");
      setLoading(false);
      return;
    }

    // Sign in
    const user = await UserQueries.userSignIn(email, password);

    // If failed
    if (!user.isLogedIn) Alert.alert("Error", "User not found");

    // Stop loading
    setLoading(false);
  };

  // On refresh
  useEffect(() => {
    if (firstLoad) {
      handleFirstLoad();
    }
  });

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[getColorScheme()].background,
      alignItems: "center",
    },
    dontHaveAcc: {
      color: colors[getColorScheme()].font.secondary,
      fontWeight: "500",
      marginBottom: 5,
    },
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
    loading: {
      color: colors[getColorScheme()].font.primary,
      fontSize: 16,
      opacity: 0.5,
    },
    login: {
      color: colors[getColorScheme()].font.primary,
      fontSize: 22,
      fontWeight: "500",
    },
    loginBtn: {
      paddingVertical: 8,
      paddingHorizontal: 50,
      borderRadius: 20,
      backgroundColor: colors[getColorScheme()].btn.background,
      marginTop: dimensions.height * 0.025,
      marginBottom: 20,
    },
    signUpBtn: {
      paddingVertical: 8,
      paddingHorizontal: 50,
      borderRadius: 20,
    },
    superContainer: {
      flex: 1,
      backgroundColor: colors[getColorScheme()].background,
    },
    title: {
      fontWeight: "600",
      fontSize: 30,
      marginBottom: dimensions.height * 0.07,
      color: colors[getColorScheme()].font.primary,
      marginTop: dimensions.height * 0.13,
    },
  });

  // React component
  return (
    <SafeAreaView style={styles.superContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{ flex: 1 }}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(value) => setEmail(value)}
                placeholder="user@example.com"
                placeholderTextColor={
                  colors[getColorScheme()].input.placeholder
                }
                textContentType="emailAddress"
                keyboardType="email-address"
                clearButtonMode="while-editing"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(value) => setPassword(value)}
                placeholder="password"
                placeholderTextColor={
                  colors[getColorScheme()].input.placeholder
                }
                textContentType="password"
                clearButtonMode="while-editing"
                secureTextEntry={true}
              />
            </View>

            {loading ? (
              <Text style={styles.loading}>Loading...</Text>
            ) : (
              <>
                {/* Login */}
                <TouchableOpacity onPress={signIn} style={styles.loginBtn}>
                  <Text style={styles.login}>Log in</Text>
                </TouchableOpacity>

                {/* Sign up */}
                <Text style={styles.dontHaveAcc}>Dont't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                  <LinearGradient
                    colors={colors[getColorScheme()].gradients.main}
                    style={styles.signUpBtn}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.login}>Sign up</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
