import React, { useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { User, onAuthStateChanged } from "firebase/auth";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, LogBox } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Import screen components
import Login from "./src/screens/Login";
import SignUp from "./src/screens/SignUp";
import Home from "./src/screens/Home";
import CreateProfile from "./src/screens/CreateProfile";
import Profiles from "./src/screens/Profiles";
import AddMed from './src/screens/AddMed';

// Import Firebase configurations
import { FIREBASE_AUTH } from "./FirebaseConfig";
import { FIRESTORE_DB } from './FirebaseConfig';

// Create Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  // State to store authenticated user information
  const [user, setUser] = useState<User | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Effect to observe authentication state changes
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user); // Log user information to console
      setUser(user); // Update user state
    });
  }, []);

  // Effect to load custom fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Montserrat-Bold': require("./assets/fonts/Montserrat-Bold.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    }
    loadFonts();
  }, []);

  // Render the app
  if (!fontsLoaded) {
    return null; // Render nothing until fonts are loaded
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        {/* Define Stack Navigator with screens and navigation options */}
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          {/* Login screen */}
          <Stack.Screen name="Login" component={Login} />
          {/* Sign up screen */}
          <Stack.Screen name="SignUp" component={SignUp} />
          {/* Home screen */}
          <Stack.Screen name="Home" component={Home} />
          {/* Create profile screen */}
          <Stack.Screen name="CreateProfile" component={CreateProfile} />
          {/* Profiles screen */}
          <Stack.Screen name="Profiles" component={Profiles} />
          {/* AddMed screen */}
          <Stack.Screen name="AddMed" component={AddMed} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
