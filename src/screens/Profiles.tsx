import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  DocumentData,
  doc,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_APP } from "../../FirebaseConfig";

type RootStackParamList = {
  Profiles: { newProfileCreated?: boolean }; // Aquí se define la propiedad 'newProfileCreated'
  // Agrega otras rutas si es necesario
};

// Component to manage user profiles
const Profiles = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "Profiles">>();
  const [userProfiles, setUserProfiles] = useState<DocumentData[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Effect hook to fetch user profiles
  useEffect(() => {
    const auth = getAuth(FIREBASE_APP);
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserId(user.uid); // Save the current user's ID
      }
    });
    return () => unsubscribe();
  }, []);

  // Effect hook to fetch user profiles for the current user
  const fetchUserProfiles = useCallback(async () => {
    try {
      if (!userId) return; // Exit if there is no user ID
      const q = query(
        collection(getFirestore(FIREBASE_APP), "profiles"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const profilesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserProfiles(profilesData);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      // Handle the error as needed
    }
  }, [userId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Verificar si se creó un nuevo perfil
      const newProfileCreated = route.params?.newProfileCreated;
      if (newProfileCreated) {
        fetchUserProfiles(); // Recargar perfiles si se creó un nuevo perfil
      }
    });

    return unsubscribe;
  }, [navigation, route.params?.newProfileCreated]);

  useEffect(() => {
    fetchUserProfiles();
  }, [fetchUserProfiles]);

  // Function to delete a profile
  const handleDeleteProfile = async (profileId: string) => {
    try {
      await deleteDoc(doc(getFirestore(FIREBASE_APP), "profiles", profileId));
      // Update the profiles list after deleting one
      setUserProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.id !== profileId)
      );
      Alert.alert("Success", "Profile deleted successfully");
    } catch (error) {
      console.error("Error deleting profile:", error);
      Alert.alert("Error", "There was a problem deleting the profile");
    }
  };

  // Function to navigate to home screen
  const handleProfileNavigation = () => {
    (navigation as any).navigate("Home");
  };

  // Function to navigate to create profile screen
  const navigateToCreateProfile = () => {
    (navigation as any).navigate("CreateProfile");
  };

  // Render component UI
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
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
      {/* Render user profiles as buttons */}
      {userProfiles.map((profile: DocumentData) => (
        <View key={profile.id} style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfileNavigation}
          >
            <Text style={styles.profileButtonText}>
              {profile.name} {profile.surname}
            </Text>
          </TouchableOpacity>
          {/* Button to delete profile */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteProfile(profile.id)}
          >
            <Image
              source={require("../../assets/delete_icon.png")}
              style={styles.deleteIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      ))}
      {/* Button to create a new profile */}
      <TouchableOpacity
        style={styles.createProfileButton}
        onPress={navigateToCreateProfile}
      >
        <Text style={[styles.createProfileButtonText, styles.customFont]}>
          Crear nuevo perfil
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0ffff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
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
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileButton: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    width: 200,
    alignItems: "center",
  },
  profileButtonText: {
    color: "#008080",
    fontWeight: "bold",
  },
  deleteButton: {
    marginLeft: 10,
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
  createProfileButton: {
    backgroundColor: "#008080",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  createProfileButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  customFont: {
    fontFamily: 'Tweety', // Aplicar la fuente personalizada
  },
});

export default Profiles;
