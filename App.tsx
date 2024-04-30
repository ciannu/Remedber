// Import necessary modules for navigation and authentication
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";

// Import screen components
import Login from "./app/screens/Login";
import SignUp from "./app/screens/SignUp";
import Home from "./app/screens/Home";
import CreateProfile from "./app/screens/CreateProfile";
import Profiles from "./app/screens/Profiles";

// Import Firebase configurations
import { FIREBASE_AUTH } from "./FirebaseConfig";
import { FIRESTORE_DB } from "./FirebaseConfig";

// Create Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  // State to store authenticated user information
  const [user, setUser] = useState<User | null>(null);

  // Effect to observe authentication state changes
  useEffect(() => {
    // Listen for changes in authentication and update user state
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user); // Log user information to console
      setUser(user); // Update user state
    });
  }, []);

  // Render navigation
  return (
    <NavigationContainer>
      {/* Define Stack Navigator with screens and navigation options */}
      <Stack.Navigator initialRouteName="Login">
        {/* Login screen */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        {/* Sign up screen */}
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        {/* Home screen */}
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        {/* Create profile screen */}
        <Stack.Screen
          name="CreateProfile"
          component={CreateProfile}
          options={{ headerShown: false }}
        />
        {/* Profiles screen */}
        <Stack.Screen
          name="Profiles"
          component={Profiles}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
