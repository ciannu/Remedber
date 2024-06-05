import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";

interface Medication {
  name: string;
  dose: string;
  amount: number;
  hour: string;
}

interface Props {
  medications: Medication[];
  onDelete: (medicationName: string) => void;
}

const MedicationInfo: React.FC<Props> = ({ medications, onDelete }) => {
  const handleDelete = (medicationName: string) => {
    // Mostrar una alerta para confirmar la eliminación
    Alert.alert(
      "Eliminar medicamento",
      `¿Estás seguro de que deseas eliminar ${medicationName}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => onDelete(medicationName)
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {medications.map((med) => (
        <View key={med.name} style={styles.medicationItem}>
          <View style={styles.medicationDetailsContainer}>
            <Text style={styles.medicationName}>{med.name}</Text>
            <Text style={styles.medicationDetails}>
              Dosis: {med.dose}, Cantidad: {med.amount}
            </Text>
          </View>
          <View style={styles.hourContainer}>
            <Text style={styles.hour}>{med.hour}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDelete(med.name)}>
            <Image
              source={require("../../assets/delete_icon.png")}
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  medicationItem: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  medicationDetailsContainer: {
    flex: 1,
  },
  medicationName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  medicationDetails: {
    color: "#888",
    fontSize: 15,
  },
  hourContainer: {
    backgroundColor: "#333",
    borderRadius: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  hour: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
});

export default MedicationInfo;
