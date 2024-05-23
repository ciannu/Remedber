import { collection, query, where, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const retrieveMedicationsForDay = async (day: Date) => {
  try {
    const medicationsRef = collection(FIRESTORE_DB, "medicines");
    const dayOfWeek = format(day, "EEEE", { locale: es }); // Formatea el día de la semana usando el locale español
    console.log("Day of the week:", dayOfWeek);

    const q = query(medicationsRef, where(`days.${dayOfWeek}`, "==", true));
    const querySnapshot = await getDocs(q);

    const medicationsArray: any[] = [];
    querySnapshot.forEach((doc) => {
      medicationsArray.push(doc.data());
      console.log("Medication data:", doc.data());
    });

    if (medicationsArray.length > 0) {
      console.log(medicationsArray);
      return medicationsArray;
    } else {
      console.log("No medications found for the selected day");
      return [];
    }
  } catch (error) {
    console.error("Error retrieving medications:", error);
    throw error;
  }
};
