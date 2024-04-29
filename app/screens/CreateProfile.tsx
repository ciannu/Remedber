import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";

const CreateProfile = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState<string>("");

  const navigation = useNavigation();

  const handleGenderSelection = (selectedGender: string) => {
    setGender(selectedGender);
  };

  const handleCreateProfile = () => {
    (navigation as any).navigate("CreateProfile");
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
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
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "Masculino" && styles.selectedGenderButton,
            ]}
            onPress={() => handleGenderSelection("Masculino")}
          >
            <Text style={styles.genderButtonText}>Masculino</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "Femenino" && styles.selectedGenderButton,
            ]}
            onPress={() => handleGenderSelection("Femenino")}
          >
            <Text style={styles.genderButtonText}>Femenino</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateProfile}
        >
          <Text style={styles.createButtonText}>Crear perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#008080",
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
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  genderButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#008080",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selectedGenderButton: {
    backgroundColor: "#008080",
  },
  genderButtonText: {
    color: "#008080",
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#008080",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CreateProfile;
