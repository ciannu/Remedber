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
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CheckBox } from "react-native-elements";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const AddMed = () => {
  const [medname, setMedname] = useState("");
  const [medType, setMedType] = useState("");
  const [medamount, setMedamount] = useState("");
  const [meddose, setMeddose] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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
  const [userId, setUserId] = useState<string>("");
  const navigation = useNavigation();
  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
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
        !selectedDate ||
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
        date: selectedDate,
        days: days,
      });

      Alert.alert("Éxito", "Medicamento guardado correctamente", [
        {
          text: "OK",
          onPress: () => {
            (navigation as any).navigate("Home"); //falta poner boolean para fetch medicamentos en HOME
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
        contentContainerStyle={{ paddingHorizontal: 25 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          value={medname}
          style={styles.input}
          placeholder="Nombre (ejemplo: Ibuprofeno)"
          onChangeText={setMedname}
        />
        {/* Dropdown para elegir el tipo de medicamento */}
        <Picker
          selectedValue={medType}
          style={styles.picker}
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
        {/* DatePicker para elegir hora y minuto */}
        <View style={styles.datePickerContainer}>
          <Button onPress={showDatepicker} title="Seleccionar Hora" />
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
        {/* Lista de días */}
        <View style={styles.daysContainer}>
          {Object.entries(days).map(([day, checked]) => (
            <View style={styles.dayItem} key={day}>
              <Text>{day}</Text>
              <CheckBox checked={checked} onPress={() => toggleDay(day)} />
            </View>
          ))}
        </View>
        {/* Botón para guardar medicamento */}
        <TouchableOpacity style={styles.saveButton} onPress={saveMedication}>
          <Text style={styles.createButtonText}>Guardar Medicamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddMed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0ffff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Montserrat-Bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
  input: {
    marginVertical: 10,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
    width: "100%",
  },
  picker: {
    marginVertical: 10,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#fff",
    width: "100%",
  },
  datePickerContainer: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  daysContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  dayItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
