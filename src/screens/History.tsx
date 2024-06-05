import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { useRoute } from "@react-navigation/native";
import { retrieveMedicationsForDay } from "../utils/medications";
import MedicationInfo from "../components/MedicationInfo";

const History = () => {
  const route = useRoute();
  const { profileName }: { profileName?: string } = route.params || {};
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [medications, setMedications] = useState<any[]>([]);

  const handleDayPress = async (day: { dateString: string }) => {
    try {
      setSelectedDate(day.dateString);
      const meds = await retrieveMedicationsForDay(new Date(day.dateString), profileName || "");
      setMedications(meds);
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudieron cargar las medicinas para este día. Inténtalo de nuevo más tarde."
      );
      console.error("Error al cargar medicinas:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{ [selectedDate]: { selected: true } }}
        theme={{ 
          calendarBackground: "#c0d9d9", // Ajusta este color de fondo a tu preferencia
        }}
        style={styles.calendar}
      />
      <View style={styles.medicationContainer}>
        <MedicationInfo medications={medications} onDelete={function (id: string): void {
                  throw new Error("Function not implemented.");
              } } />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0ffff",
  },
  medicationContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  calendar: {
    marginTop: 20,
  },
});

export default History;
