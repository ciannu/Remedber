import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import CalendarComponent from "../components/CalendarComponent";
import { retrieveMedicationsForDay } from "../utils/medications";
import MedicationInfo from "../components/MedicationInfo";

const Home = () => {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [medications, setMedications] = useState<any[]>([]);
  const route = useRoute();
  const { profileName }: { profileName?: string } = route.params || {};

  useEffect(() => {
    const fetchMedications = async () => {
      if (selectedDay && profileName) {
        const meds = await retrieveMedicationsForDay(selectedDay, profileName);
        setMedications(meds);
      }
    };
    fetchMedications();
  }, [selectedDay, profileName]);

  const handleAddMedication = () => {
    ( navigation as any ).navigate("AddMed", { profileName });
  };

  const handleDayPress = (day: Date) => {
    setSelectedDay(day);
  };

  const handleDeleteMedication = (medicationName: string) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que quieres eliminar ${medicationName}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            // Aquí deberías implementar la lógica para eliminar el medicamento
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus Medicinas</Text>
      <Text style={styles.subtitle}>Perfil: {profileName}</Text>
      <View style={styles.calendarContainer}>
        <CalendarComponent
          onDayPress={handleDayPress}
          selectedDate={selectedDay}
        />
      </View>
      <TouchableOpacity onPress={handleAddMedication} style={styles.button}>
        <Image source={require("../../assets/add.png")} style={styles.image} />
      </TouchableOpacity>

      {medications.length > 0 && (
        <View style={styles.medicationInfoContainer}>
          <MedicationInfo medications={medications} onDelete={handleDeleteMedication} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0ffff",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 25,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  calendarContainer: {
    paddingHorizontal: 10,
    height: 250,
  },
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  image: {
    width: 50,
    height: 50,
  },
  medicationInfoContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
});

export default Home;
