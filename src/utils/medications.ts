import { collection, query, where, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { doc, deleteDoc } from "firebase/firestore";
import { Medication } from '../types/types';

// Función para recuperar medicamentos para un día específico
export const retrieveMedicationsForDay = async (
  day: Date,
  profileName: string
): Promise<Medication[]> => {
  try {
    const medicationsRef = collection(FIRESTORE_DB, "medicines");

    // Obtén el día de la semana en español y conviértelo a minúsculas
    const dayOfWeek = format(day, "EEEE", { locale: es }).toLowerCase();

    // Normaliza el nombre del día de la semana para que coincida con la estructura de datos en Firestore
    const normalizedDayOfWeek = dayOfWeek
      .replace("miércoles", "miercoles")
      .replace("sábado", "sabado");

    // Valida que el día de la semana sea válido
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

    // Consulta Firestore para recuperar medicamentos para el día específico y el perfil dado
    const q = query(
      medicationsRef,
      where(`days.${normalizedDayOfWeek}`, "==", true),
      where("start_date", "<=", day),
      where("end_date", ">=", day),
      where("profileName", "==", profileName)
    );

    // Ejecuta la consulta y obtén el resultado
    const querySnapshot = await getDocs(q);
    const medicationsArray: Medication[] = [];

    // Itera sobre los resultados y agrega los medicamentos al array
    querySnapshot.forEach((doc) => {
      medicationsArray.push({ id: doc.id, ...doc.data() } as Medication);
    });

    // Si no se encontraron medicamentos para el día específico, registra un mensaje en la consola
    if (medicationsArray.length === 0) {
      console.log(`No se encontraron medicamentos para el día: ${normalizedDayOfWeek}`);
    }

    return medicationsArray;
  } catch (error: any) {
    console.error("Error recuperando medicamentos", error);
    // Si hay un error y se requiere un índice, muestra un mensaje al usuario
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

// Función para eliminar un medicamento según su ID
export const deleteMedication = async (medicationId: string): Promise<void> => {
  try {
    const medicationRef = doc(FIRESTORE_DB, "medicines", medicationId);
    // Elimina el documento de Firestore
    await deleteDoc(medicationRef);
    console.log(`Medicamento con ID ${medicationId} eliminado`);
  } catch (error) {
    console.error("Error eliminando el medicamento", error);
    throw new Error("No se pudo eliminar el medicamento");
  }
};
