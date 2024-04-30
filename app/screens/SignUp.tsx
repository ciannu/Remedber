import {
    KeyboardAvoidingView,
    View,
    Image,
    TextInput,
    StyleSheet,
    Button,
    Alert,
    TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";

const SignUp = () => {
    // State variables to store user input and loading state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Firebase authentication instance
    const auth = FIREBASE_AUTH;

    // Navigation hook
    const navigation = useNavigation();

    // Function to register a new user account
    const register = async () => {
        setLoading(true); // Set loading state to true
        try {
            // Validate password and confirm password fields
            if (password !== confirmPassword) {
                throw new Error("Las contraseñas no coinciden");
            }
            if (password.length < 6) {
                throw new Error("La contraseña debe tener al menos 6 carácteres");
            }

            // Check if email is already associated with an account
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                throw new Error("Una cuenta con ese email ya existe.");
            }

            // Create new user account with Firebase authentication
            const response = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log(response);

            // Display success message and navigate back to previous screen
            Alert.alert("Éxito", "Cuenta creada correctamente", [
                {
                    text: "OK",
                    onPress: () => {
                        navigation.goBack();
                    },
                },
            ]);
        } catch (error: any) {
            // Handle errors during registration
            if (error.code === "auth/email-already-in-use") {
                alert("Una cuenta con ese correo ya existe");
            } else {
                console.log(error);
                alert("Registro fallido: " + error.message);
            }
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    // Render sign up form
    return (
        <View style={styles.container}>
            {/* Keyboard avoiding view to handle input */}
            <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
                {/* Logo */}
                <Image
                    source={require("../../assets/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
                {/* Email input */}
                <TextInput
                    value={email}
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}
                />
                {/* Password input */}
                <TextInput
                    secureTextEntry={true}
                    value={password}
                    style={styles.input}
                    placeholder="Contraseña"
                    autoCapitalize="none"
                    onChangeText={(text) => setPassword(text)}
                />
                {/* Confirm password input */}
                <TextInput
                    secureTextEntry={true}
                    value={confirmPassword}
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    autoCapitalize="none"
                    onChangeText={(text) => setConfirmPassword(text)}
                />

                {/* Button to create account */}
                <View style={styles.buttonContainer}>
                    <Button title="Crear cuenta" onPress={register} color="#008080" />
                </View>
                
                {/* Button to navigate back */}
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
            </KeyboardAvoidingView>
        </View>
    );
};

export default SignUp;
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
});
