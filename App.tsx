import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { User, onAuthStateChanged } from "firebase/auth";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";



import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
} from "./src/utils/notifications";

import Login from "./src/screens/Login";
import SignUp from "./src/screens/SignUp";
import Home from "./src/screens/Home";
import CreateProfile from "./src/screens/CreateProfile";
import Profiles from "./src/screens/Profiles";
import AddMed from "./src/screens/AddMed";
import History from "./src/screens/History"
import { FIREBASE_AUTH } from "./FirebaseConfig";
import { FIRESTORE_DB } from "./FirebaseConfig";

const Stack = createNativeStackNavigator();

export default function App() {
  // almacenar info usuario autenticado
  const [user, setUser] = useState<User | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // observar cambios en la autenticacion
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          setUser({} as User);
        }
      } catch (error) {
        console.error("Error al verificar el estado de autenticación:", error);
      }
    };
    checkAuthState();
  }, []);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        setUser(user);
        try {
          const accessToken = await user.getIdToken();
          await AsyncStorage.setItem("accessToken", accessToken);
        } catch (error) {
          console.error("Error al almacenar el token de acceso:", error);
        }
      } else {
        setUser(null);
        try {
          await AsyncStorage.removeItem("accessToken");
        } catch (error) {
          console.error("Error al eliminar el token de acceso:", error);
        }
      }
    });
  }, []);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Tweety: require("./assets/fonts/Tweety.otf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    }
    registerForPushNotificationsAsync();
    loadFonts();
  }, []);

  useEffect(() => {
    if (user) {
    }
  }, [user]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Home" component={Home} />

          <Stack.Screen name="CreateProfile" component={CreateProfile} />
          <Stack.Screen name="Profiles" component={Profiles} />
          <Stack.Screen name="AddMed" component={AddMed} />
          <Stack.Screen name="History" component={History} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
