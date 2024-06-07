import { collection, query, where, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { doc, deleteDoc } from "firebase/firestore";
import { Medication } from '../types/types';

// función para recuperar medicamentos para un día específico
export const retrieveMedicationsForDay = async (
  day: Date,
  profileName: string
): Promise<Medication[]> => {
  try {
    const medicationsRef = collection(FIRESTORE_DB, "medicines");

    const dayOfWeek = format(day, "EEEE", { locale: es }).toLowerCase();

    const normalizedDayOfWeek = dayOfWeek
      .replace("miércoles", "miercoles")
      .replace("sábado", "sabado");

    const validDays = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ];
    if (!validDays.includes(normalizedDayOfWeek)) {
      throw new Error(`Día de la semana no válido: ${normalizedDayOfWeek}`);
    }

    const q = query(
      medicationsRef,
      where(`days.${normalizedDayOfWeek}`, "==", true),
      where("start_date", "<=", day),
      where("end_date", ">=", day),
      where("profileName", "==", profileName)
    );

    const querySnapshot = await getDocs(q);
    const medicationsArray: Medication[] = [];

    querySnapshot.forEach((doc) => {
      medicationsArray.push({ id: doc.id, ...doc.data() } as Medication);
    });

    if (medicationsArray.length === 0) {
      console.log(`No se encontraron medicamentos para el día: ${normalizedDayOfWeek}`);
    }

    return medicationsArray;
  } catch (error: any) {
    console.error("Error recuperando medicamentos", error);
    if (error.message.includes("La query requiere de un índice")) {
      console.error(
        "Necesitas crear un índice compuesto en Firestore. Sigue este enlace para crearlo:",
        error.message
      );
      throw new Error(
        "Necesitas crear un índice compuesto en Firestore. Sigue este enlace para crearlo: " +
          error.message
      );
    } else {
      throw error;
    }
  }
};

// función para eliminar un medicamento según su ID
export const deleteMedication = async (medicationId: string): Promise<void> => {
  try {
    const medicationRef = doc(FIRESTORE_DB, "medicines", medicationId);
    await deleteDoc(medicationRef);
    console.log(`Medicamento con ID ${medicationId} eliminado`);
  } catch (error) {
    console.error("Error eliminando el medicamento", error);
    throw new Error("No se pudo eliminar el medicamento");
  }
};
