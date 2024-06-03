import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CheckBox } from "react-native-elements";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { ColorLuminance } from "../utils/Color";

const AddMed = () => {
  const [medname, setMedname] = useState("");
  const [medType, setMedType] = useState("");
  const [medamount, setMedamount] = useState("");
  const [meddose, setMeddose] = useState("");
  const [selectedHour, setSelectedHour] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [showTimePicker, setShowTimePicker] = useState(false); // Cambiado a false
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [days, setDays] = useState<{
    [key: string]: boolean;
  }>({
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false,
    domingo: false,
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [userId, setUserId] = useState<string>("");
  const navigation = useNavigation();

  const handleTimeChange = (event: any, selectedDate: Date | undefined) => {
    setShowTimePicker(false);
    if (event.type === "set" && selectedDate) {
      setSelectedHour(
        selectedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  };

  const handleStartDateChange = (
    event: any,
    selectedDate: Date | undefined
  ) => {
    setShowStartDatePicker(false);
    if (event.type === "set" && selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowEndDatePicker(false);
    if (event.type === "set" && selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const toggleDay = (day: string) => {
    setDays({ ...days, [day]: !days[day] });
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const saveMedication = async () => {
    try {
      if (!userId) {
        Alert.alert("Error", "Fallo al obtener el ID del usuario");
        return;
      }

      if (
        !medname.trim() ||
        !medType.trim() ||
        !meddose.trim() ||
        !medamount.trim() ||
        !selectedHour ||
        !days
      ) {
        Alert.alert("Error", "Por favor rellene todos los campos.");
        return;
      }

      await addDoc(collection(FIRESTORE_DB, "medicines"), {
        userId: userId,
        name: medname,
        type: medType,
        dose: meddose,
        amount: medamount,
        start_date: Timestamp.fromDate(startDate),
        end_date: Timestamp.fromDate(endDate),
        hour: selectedHour,
        days: days,
      });

      Alert.alert("Éxito", "Medicamento guardado correctamente", [
        {
          text: "OK",
          onPress: () => {
            (navigation as any).navigate("Home");
          },
        },
      ]);
    } catch (error) {
      console.error("error guardando el medicamento", error);
      Alert.alert("Error", "Hubo un problema guardando el medicamento");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Medicamento</Text>
      <Text style={styles.subtitle}>
        Rellena los campos y aprieta el botón de Guardado para agregarlo
      </Text>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ paddingHorizontal: 25, paddingVertical: 40 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          value={medname}
          style={styles.input}
          placeholder="Nombre (ejemplo: Ibuprofeno)"
          onChangeText={setMedname}
        />
        <Picker
          selectedValue={medType}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => setMedType(itemValue)}
        >
          <Picker.Item label="Selecciona el tipo de medicamento" value="" />
          <Picker.Item label="Pastilla/Cápsula" value="pastilla" />
          <Picker.Item label="Gotas" value="gotas" />
          <Picker.Item label="Crema" value="crema" />
          <Picker.Item label="Inyección" value="inyeccion" />
        </Picker>
        <TextInput
          value={meddose}
          style={styles.input}
          placeholder="Dosis (ejemplo: 100mg)"
          onChangeText={setMeddose}
        />
        <TextInput
          value={medamount}
          style={styles.input}
          placeholder="Cantidad (ejemplo: 2)"
          onChangeText={setMedamount}
        />
        <View style={styles.datePickerContainer}>
          <Button
            onPress={() => setShowTimePicker(true)}
            title="Seleccionar Hora"
            color="#008080"
          />
          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={new Date()}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>
        <View style={styles.daysContainer}>
          {Object.entries(days).map(([day, checked]) => (
            <View style={styles.dayItem} key={day}>
              <Text>{day}</Text>
              <CheckBox checked={checked} onPress={() => toggleDay(day)} />
            </View>
          ))}
        </View>
        <View style={styles.datePickerContainer}>
          <Text style={styles.label}>Fecha de inicio del tratamiento:</Text>
          <Button
            onPress={() => setShowStartDatePicker(true)}
            title="Seleccionar Fecha de Inicio"
            color="#008080"
          />
          {showStartDatePicker && (
            <DateTimePicker
              testID="startDatePicker"
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
        </View>
        <View style={styles.datePickerContainer}>
          <Text style={styles.label}>Fecha de fin del tratamiento:</Text>
          <Button
            onPress={() => setShowEndDatePicker(true)}
            title="Seleccionar Fecha de Fin"
            color="#008080"
          />
          {showEndDatePicker && (
            <DateTimePicker
              testID="endDatePicker"
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={saveMedication}>
          <Text style={styles.saveButtonText}>Guardar Medicamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0FFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 25,
    textAlign: "center",
    color: "#008080",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 35,
    textAlign: "center",
    color: "#555",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 35,
    backgroundColor: ColorLuminance("#E0FFFF", 0.8),
  },
  datePickerContainer: {
    marginBottom: 35,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 25,
  },
  dayItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#008080",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddMed;
