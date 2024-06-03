import { collection, query, where, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const retrieveMedicationsForDay = async (day: Date) => {
  try {
    const medicationsRef = collection(FIRESTORE_DB, "medicines");
    const dayOfWeek = format(day, "EEEE", { locale: es }).toLowerCase();

    // Verifica que el día de la semana esté formateado correctamente
    const validDays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
    if (!validDays.includes(dayOfWeek)) {
      throw new Error(`Día de la semana no válido: ${dayOfWeek}`);
    }

    const q = query(
      medicationsRef,
      where(`days.${dayOfWeek}`, "==", true),
      where("start_date", "<=", day),
      where("end_date", ">=", day)
    );

    const querySnapshot = await getDocs(q);
    const medicationsArray: any[] = [];

    querySnapshot.forEach((doc) => {
      medicationsArray.push(doc.data());
    });

    return medicationsArray;
  } catch (error: any) { // Especifica el tipo de error como 'Error'
    console.error("Error recuperando medicamentos", error);
    if (error.message.includes('The query requires an index')) {
      console.error("Necesitas crear un índice compuesto en Firestore. Sigue este enlace para crearlo:", error.message);
      throw new Error("Necesitas crear un índice compuesto en Firestore. Sigue este enlace para crearlo: " + error.message);
    } else {
      throw error;
    }
  }
};
