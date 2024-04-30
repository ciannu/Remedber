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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Estado para recordar credenciales

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
            (navigation as any).navigate("Profiles");
          },
        },
      ]);

      // Guardar email y contraseña en AsyncStorage si "Recuérdame" está marcado
      if (rememberMe) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
      }
    } catch (error: any) {
      console.error(error);
      alert("Inicio de sesión fallido: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = () => {
    (navigation as any).navigate("SignUp");
  };

  useEffect(() => {
    const checkStoredCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("email");
        const storedPassword = await AsyncStorage.getItem("password");
        if (storedEmail && storedPassword) {
          setEmail(storedEmail);
          setPassword(storedPassword);
          setRememberMe(true); // Marcar como recordado si se encuentran credenciales almacenadas
        }
      } catch (error: any) {
        console.error("Error retrieving stored credentials:", error.message);
      }
    };

    checkStoredCredentials();
  }, []);

  // Función para manejar el cambio en el estado de "Recuérdame"
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

        {/* Botón para cambiar el estado de "Recuérdame" */}
        <View style={styles.rememberMeContainer}>
          <Button
            title={rememberMe ? "No recordar" : "Recuérdame"}
            onPress={toggleRememberMe}
            color="#008080"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Iniciar sesión" onPress={signIn} color="#008080" />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Registrarse" onPress={signUp} color="#008080" />
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
