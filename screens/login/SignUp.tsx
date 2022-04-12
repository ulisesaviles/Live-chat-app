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
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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

  const inputsAreValid = (): boolean => {
    // Email
    if (!isAValidEmail(email.trim())) {
      Alert.alert("Enter a valid email");
      return false;
    }

    // Name
    if (name.trim().length < 3) {
      Alert.alert("Enter a name with more than 2 characters");
      return false;
    }

    // Password
    if (password.trim().length < 6) {
      Alert.alert("Enter a name with more than 6 characters");
      return false;
    }

    // Confirm password
    if (password !== passwordConfirmation) {
      Alert.alert("The passwords are not the same");
      return false;
    }

    return true;
  };

  const isAValidEmail = (email: string) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test(email)) {
      return true;
    }
  };

  // Functions
  const signUp = async () => {
    // Start loading
    setLoading(true);

    // Check inputs
    if (!inputsAreValid()) {
      setLoading(false);
      return;
    }

    // Create user and sign in
    const user = await UserQueries.createUser(
      email.trim(),
      password.trim(),
      name.trim()
    );

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
      color: "white",
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
      marginBottom: dimensions.height * 0.05,
      color: colors[getColorScheme()].font.primary,
      marginTop: dimensions.height * 0.08,
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
            <Text style={styles.title}>Sign up</Text>

            {/* Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(value) => setName(value)}
                placeholder="Your name"
                placeholderTextColor={
                  colors[getColorScheme()].input.placeholder
                }
                textContentType="name"
                clearButtonMode="while-editing"
                autoCapitalize="words"
              />
            </View>

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
                textContentType="newPassword"
                clearButtonMode="while-editing"
                secureTextEntry={true}
              />
            </View>

            {/* Repeat password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Confirm password</Text>
              <TextInput
                style={styles.input}
                value={passwordConfirmation}
                onChangeText={(value) => setPasswordConfirmation(value)}
                placeholder="password"
                placeholderTextColor={
                  colors[getColorScheme()].input.placeholder
                }
                textContentType="newPassword"
                clearButtonMode="while-editing"
                secureTextEntry={true}
              />
            </View>

            {/* BTn */}
            {loading ? (
              <Text style={styles.loading}>Loading...</Text>
            ) : (
              <TouchableOpacity onPress={signUp}>
                <LinearGradient
                  colors={colors[getColorScheme()].gradients.main}
                  style={styles.signUpBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.login}>Sign up</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
