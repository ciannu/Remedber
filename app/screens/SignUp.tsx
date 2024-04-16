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
import { useNavigation } from "@react-navigation/native"; // Importa useNavigation
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const navigation = useNavigation(); // Usa useNavigation para obtener la función de navegación

    const register = async () => {
        setLoading(true);
        try {
            if (password !== confirmPassword) {
                throw new Error("Las contraseñas no coinciden");
            }

            if (password.length < 6) {
                throw new Error("La contraseña debe tener al menos 6 caracteres");
            }

            // Verifica si ya existe una cuenta con el correo electrónico proporcionado
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                throw new Error("Ya existe una cuenta asociada a este correo electrónico");
            }

            const response = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log(response);

            // Muestra un mensaje de éxito
            Alert.alert("Éxito", "Cuenta creada con éxito", [
                {
                    text: "OK",
                    onPress: () => {
                        // Navega hacia atrás después de cerrar el aviso
                        navigation.goBack();
                    },
                },
            ]);
        } catch (error: any) {
            if (error.code === "auth/email-already-in-use") {
                alert("Ya existe una cuenta asociada a este correo electrónico");
            } else {
                console.log(error);
                alert("Registro fallido: " + error.message);
            }
        } finally {
            setLoading(false);
        }
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
                <TextInput
                    secureTextEntry={true}
                    value={confirmPassword}
                    style={styles.input}
                    placeholder="Repite la contraseña"
                    autoCapitalize="none"
                    onChangeText={(text) => setConfirmPassword(text)}
                />

                <View style={styles.buttonContainer}>
                    <Button title="Crear cuenta" onPress={register} color="#008080" />
                </View>
                {/* Botón para regresar a la pantalla de inicio de sesión */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    {/* Icono de flecha hacia atrás */}
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
        bottom: -100, // Ajusta esta propiedad para cambiar la posición vertical del botón
        alignSelf: "center",
    },
    backIcon: {
        width: 50, // Ajusta el tamaño del icono
        height: 50, // Ajusta el tamaño del icono
    },
});
