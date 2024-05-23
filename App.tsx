import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { User, onAuthStateChanged } from "firebase/auth";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import Login from "./src/screens/Login";
import SignUp from "./src/screens/SignUp";
import Home from "./src/screens/Home";
import CreateProfile from "./src/screens/CreateProfile";
import Profiles from "./src/screens/Profiles";
import AddMed from "./src/screens/AddMed";

import { FIREBASE_AUTH } from "./FirebaseConfig";
import { FIRESTORE_DB } from "./FirebaseConfig";

const Stack = createNativeStackNavigator();

export default function App() {
  // almacenar info usuario autenticado
  const [user, setUser] = useState<User | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // observar cambios en la autenticacion
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user); // log usuario info
      setUser(user); // actualizar estado usuario
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
    loadFonts();
  }, []);

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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
