import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, DrawerLayoutAndroid } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import CalendarComponent from "../components/CalendarComponent";
import { retrieveMedicationsForDay, deleteMedication } from "../utils/medications";
import MedicationInfo from "../components/MedicationInfo";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

const Home = () => {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [medications, setMedications] = useState<any[]>([]);
  const route = useRoute();
  const { profileName }: { profileName?: string } = route.params || {};
  const drawerRef = useRef<DrawerLayoutAndroid>(null);

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
    (navigation as any).navigate("AddMed", { profileName });
  };

  const handleDayPress = (day: Date) => {
    setSelectedDay(day);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMedication(id);
      setMedications((prevMeds) => prevMeds.filter((med) => med.id !== id));
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el medicamento");
    }
  };

  const openDrawer = () => {
    drawerRef.current?.openDrawer();
  };

  const closeDrawer = () => {
    drawerRef.current?.closeDrawer();
  };

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      console.log("Sesión cerrada exitosamente");
      closeDrawer();
      (navigation as any).navigate("Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Deseas cerrar la sesión actual?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Aceptar", onPress: handleLogout }
      ]
    );
  };

  const handleShowHistory = () => {
    (navigation as any).navigate("History", { profileName });
    closeDrawer();
  };

  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <TouchableOpacity style={styles.drawerOption} onPress={handleShowHistory}>
        <Text style={styles.drawerText}>Mostrar Historial</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Image source={require("../../assets/logout.png")} style={styles.logoutIcon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={navigationView}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Tus Medicinas</Text>
        <Text style={styles.subtitle}>Perfil: {profileName}</Text>
        <TouchableOpacity onPress={handleAddMedication} style={styles.button}>
          <Image source={require("../../assets/add.png")} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Image source={require("../../assets/menu.png")} style={styles.menu} />
        </TouchableOpacity>

        <View style={styles.calendarContainer}>
          <CalendarComponent onDayPress={handleDayPress} selectedDate={selectedDay} />
        </View>

        {medications.length > 0 && (
          <View style={styles.medicationInfoContainer}>
            <MedicationInfo medications={medications} onDelete={handleDelete} />
          </View>
        )}
      </View>
    </DrawerLayoutAndroid>
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
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  menuButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  image: {
    width: 50,
    height: 50,
  },
  menu: {
    width: 32,
    height: 32,
    marginTop: 16,
  },
  calendarContainer: {
    paddingHorizontal: 10,
    height: 250,
  },
  medicationInfoContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  navigationContainer: {
    flex: 1,
    backgroundColor: "rgba(170, 255, 255, 0.8)",
    paddingTop: 50,
    paddingLeft: 20,
  },
  drawerOption: {
    marginBottom: 20,
  },
  drawerText: {
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#333", 
  },
  logoutButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  logoutIcon: {
    width: 32,
    height: 32,
  },
});

export default Home;

