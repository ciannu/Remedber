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
import { FIREBASE_AUTH } from "../../FirebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

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
    } catch (error: any) {
      console.error(error);
      alert("Login fallido: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = () => {
    (navigation as any).navigate("SignUp");
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

        <View style={styles.buttonContainer}>
          <Button title="Sign In" onPress={signIn} color="#008080" />
        </View>

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
});
