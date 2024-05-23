import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CalendarComponent from '../components/CalendarComponent';
import { retrieveMedicationsForDay } from '../utils/medications'; // Importa la función para recuperar medicamentos
import { format } from 'date-fns';

const Home: React.FC = () => {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const handleAddMedication = () => {
    (navigation as any).navigate('AddMed');
  };

  const handleDayPress = (day: Date) => {
    setSelectedDay(day);
    // Retrieve medications from Firebase that match the selected day
    retrieveMedicationsForDay(day);
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <CalendarComponent onDayPress={handleDayPress} selectedDate={selectedDay} />
      </View>
      <TouchableOpacity onPress={handleAddMedication} style={styles.button}>
        <Image source={require('../../assets/add.png')} style={styles.image} />
      </TouchableOpacity>

      {/* falta separar los medicamentos perfiles, porque se asignan todos a la misma cuenta*/}
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
