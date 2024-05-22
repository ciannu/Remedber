import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";

const CreateProfile = () => {
  // State variables to store user input
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const navigation = useNavigation();

  // Effect hook to get user ID when component mounts
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Function to handle gender selection
  const handleGenderSelection = (selectedGender: string) => {
    setGender(selectedGender);
  };

  // Function to create a new profile
  const handleCreateProfile = async () => {
    try {
      if (!userId) {
        Alert.alert("Error", "Fallo al obtener el ID del usuario");
        return;
      }

      if (!name.trim() || !surname.trim() || !gender) {
        Alert.alert("Error", "Por favor rellena todos los campos");
        return;
      }

      // Add new profile to Firestore
      await addDoc(collection(FIRESTORE_DB, "profiles"), {
        userId: userId,
        name: name,
        surname: surname,
        gender: gender,
      });

      // Display success message and navigate back
      Alert.alert("Éxito", "Perfil creado correctamente", [
        {
          text: "OK",
          onPress: () => {
            (navigation as any).navigate("Profiles", { newProfileCreated: true });
          },
        },
      ]);
    } catch (error) {
      console.error("Error creando el perfil", error);
      Alert.alert("Error", "Hubo un problema creando tu perfil.");
    }
  };

  // Render create profile form
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* Logo */}
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        {/* Title */}
        <Text style={styles.title}>Crea tu perfil</Text>
        {/* Name input */}
        <TextInput
          value={name}
          style={styles.input}
          placeholder="Introduce tu nombre"
          onChangeText={(text) => setName(text)}
        />
        {/* Surname input */}
        <TextInput
          value={surname}
          style={styles.input}
          placeholder="Introduce tu apellido"
          onChangeText={(text) => setSurname(text)}
        />
        {/* Gender selection buttons */}
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
        {/* Button to create profile */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateProfile}
        >
          <Text style={styles.createButtonText}>Crear perfil</Text>
        </TouchableOpacity>
      </View>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require("../../assets/back_arrow.png")}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default CreateProfile;

// Stylesheet
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
});
