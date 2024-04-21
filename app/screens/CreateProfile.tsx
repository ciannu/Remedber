import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";

const CreateProfile = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState("Male");

  //const toggleSwitch = () => setGender()
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Crea tu perfil</Text>
        <TextInput
          value={name}
          style={styles.input}
          placeholder="Introduce tu nombre"
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          value={surname}
          style={styles.input}
          placeholder="Introduce tu apellido"
          onChangeText={(text) => setSurname(text)}
        />

      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateProfile;

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
  backButton: {
    position: "absolute",
    bottom: -100,
    alignSelf: "center",
  },
  backIcon: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#008080",
  }
  
});
