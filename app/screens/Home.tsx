import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleAddMedication = () => {
    // Navegar a la pantalla para agregar medicamento
    (navigation as any).navigate("CreateProfile");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleAddMedication}>
        <Image source={require('../../assets/add.png')} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0ffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
});

export default HomeScreen;
