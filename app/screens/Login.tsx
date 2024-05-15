import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Image,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

const Login = () => {
  const [email, setEmail] = useState(""); // State variable to store user email
  const [password, setPassword] = useState(""); // State variable to store user password
  const [loading, setLoading] = useState(false); // State variable to manage loading state
  const [rememberMe, setRememberMe] = useState(false); // State variable to remember user credentials

  const auth = FIREBASE_AUTH; // Firebase authentication instance
  const navigation = useNavigation(); // Navigation hook

  // Function to sign in with email and password
  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      const userId = response.user.uid;

      console.log("USER ID: ", userId);

      Alert.alert("Éxito", "Sesión iniciada correctamente", [
        {
          text: "OK",
          onPress: () => {
            (navigation as any).navigate("Profiles", { userId });
          },
        },
      ]);

      // Save email and password to AsyncStorage if "Remember Me" is checked
      if (rememberMe) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
      }
    } catch (error: any) {
      console.error(error);
      alert("Login fallido: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to navigate to sign up screen
  const signUp = () => {
    (navigation as any).navigate("SignUp");
  };

  // Effect hook to check if there are stored credentials
  useEffect(() => {
    const checkStoredCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("email");
        const storedPassword = await AsyncStorage.getItem("password");
        if (storedEmail && storedPassword) {
          setEmail(storedEmail);
          setPassword(storedPassword);
          setRememberMe(true); // Mark as remembered if credentials are found
        }
      } catch (error: any) {
        console.error(
          "Error al recuperar las credenciales guardadas",
          error.message
        );
      }
    };

    checkStoredCredentials();
  }, []);

  // Function to handle the change in "Remember Me" state
  const toggleRememberMe = () => {
    setRememberMe((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Contraseña"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        />

        {/* Button to change "Remember Me" state 
        <View style={styles.rememberMeContainer}>
          <Button
            title={rememberMe ? "Forget Me" : "Remember Me"}
            onPress={toggleRememberMe}
            color="#008080"
          />
        </View>
*/}
        {/* Button to sign in */}
        <View style={styles.buttonContainer}>
          <Button title="Sign In" onPress={signIn} color="#008080" />
        </View>

        {/* Button to navigate to sign up */}
        <View style={styles.buttonContainer}>
          <Button title="Sign Up" onPress={signUp} color="#008080" />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0ffff",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "80%",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  input: {
    marginVertical: 10,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#e0ffff",
    width: "100%",
  },
  buttonContainer: {
    marginVertical: 5,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  rememberMeContainer: {
    marginVertical: 10,
    width: "100%",
  },
});
