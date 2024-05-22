import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CalendarComponent from '../components/CalendarComponent';

const Home: React.FC = () => {
  const navigation = useNavigation();

  const handleAddMedication = () => {
    // Navegar a la pantalla para agregar medicamento
    (navigation as any).navigate('AddMed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <CalendarComponent />
      </View>
      <TouchableOpacity onPress={handleAddMedication} style={styles.button}>
        <Image source={require('../../assets/add.png')} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {  
    flex: 1,
    backgroundColor: '#e0ffff',
  },
  calendarContainer: {
    marginTop: 20, 
    paddingHorizontal: 10, 
    height: 300, 
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  image: {
    width: 50,
    height: 50,
  },
});

export default Home;
