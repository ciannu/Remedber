import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const Header = () => {

  const handleMenuPress = () => {

  };


  const handleProfilePress = () => {
  
  };

  return (
    <View style={styles.container}>
      {/* Icono de menú */}
      <TouchableOpacity onPress={handleMenuPress} style={styles.icon}>
        <Image
          source={require("../assets/menu_icon.png")} // Ruta de la imagen del icono de menú
          style={styles.iconImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      {/* Logotipo */}
      <Image
        source={require("../../assets/logo.png")} // Ruta de la imagen del logotipo
        style={styles.logo}
        resizeMode="contain"
      />
      
      {/* Foto de perfil */}
      <TouchableOpacity onPress={handleProfilePress} style={styles.profile}>
        <Image
          source={require("../assets/profile_image.png")} // Ruta de la imagen de perfil
          style={styles.profileImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 80,
    backgroundColor: "#008080",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  logo: {
    width: 120,
    height: 40,
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconImage: {
    width: "100%",
    height: "100%",
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
});
