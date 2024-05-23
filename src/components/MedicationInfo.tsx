// MedicationInfo.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Medication {
  name: string;
  dose: string;
  amount: number;
  hour: string;
}

interface Props {
  medications: Medication[];
}

const MedicationInfo: React.FC<Props> = ({ medications }) => {
  return (
    <View style={styles.container}>
      {medications.map(med => (
        <View key={med.name} style={styles.medicationItem}>
          <View style={styles.medicationDetailsContainer}>
            <Text style={styles.medicationName}>{med.name}</Text>
            <Text style={styles.medicationDetails}>Dosis: {med.dose}, Cantidad: {med.amount}</Text>
          </View>
          <View style={styles.hourContainer}><Text style={styles.hour}>{med.hour}</Text></View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 10, // Margen horizontal para el contenedor principal
  },
  medicationItem: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between', // Alinear los elementos horizontalmente
    alignItems: 'center',
    paddingHorizontal: 20, // Margen horizontal para cada elemento de medicamento
  },
  medicationDetailsContainer: {
    flex: 1, // Para que el nombre y la dosis/cantidad ocupen el espacio disponible
  },
  medicationName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  medicationDetails: {
    color: '#888',
    fontSize: 15,
  },
  hourContainer: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 8,
    alignItems: 'center', // Alinear la hora verticalmente
    justifyContent: 'center', // Alinear la hora horizontalmente
    marginLeft: 10, // Espacio entre el detalle del medicamento y la hora
  },
  hour: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default MedicationInfo;
