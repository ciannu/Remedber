import { KeyboardAvoidingView, View } from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const Register = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
    } catch (error: any) {
      console.log(error);
      alert("Registro fallido: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return <View></View>;
};

export default SignUp;
