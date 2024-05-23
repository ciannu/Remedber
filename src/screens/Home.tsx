// Home.tsx

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CalendarComponent from "../components/CalendarComponent";
import { retrieveMedicationsForDay } from "../utils/medications";
import MedicationInfo from "../components/MedicationInfo";

const Home: React.FC = () => {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [medications, setMedications] = useState<any[]>([]);

  const handleAddMedication = () => {
    (navigation as any).navigate("AddMed");
  };

  const handleDayPress = async (day: Date) => {
    setSelectedDay(day);
    const medications = await retrieveMedicationsForDay(day);
    setMedications(medications);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus Medicinas</Text>
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
          <MedicationInfo medications={medications} />
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
