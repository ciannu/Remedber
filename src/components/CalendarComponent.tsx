import { addDays, eachDayOfInterval, eachWeekOfInterval, format, startOfWeek, subWeeks } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';

const CalendarComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weeks, setWeeks] = useState<Date[][]>([]);

  // Función para generar las semanas del calendario
  const generateWeeks = () => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });

    // Genera las semanas del calendario, incluyendo una semana anterior y una siguiente
    const generatedWeeks = eachWeekOfInterval(
      {
        start: subWeeks(startOfCurrentWeek, 1), // Una semana antes
        end: addDays(startOfCurrentWeek, 13), // Dos semanas después
      },
      { weekStartsOn: 1 }
    ).map((weekStart) =>
      eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) })
    );

    // Asegura que la semana del día actual esté en la segunda posición del arreglo
    const currentIndex = generatedWeeks.findIndex(week =>
      week.some(day => day.toDateString() === today.toDateString())
    );
    const sortedWeeks = [
      ...generatedWeeks.slice(currentIndex),
      ...generatedWeeks.slice(0, currentIndex)
    ];

    setWeeks(sortedWeeks);
  };

  // Efecto para generar las semanas al montar el componente
  useEffect(() => {
    generateWeeks();
  }, []);

  // Efecto para seleccionar automáticamente el día actual
  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
  }, []);

  // Función para manejar el evento de presionar un día
  const handleDayPress = (day: Date) => {
    setSelectedDate(day);
  };

  return (
    <PagerView style={styles.pagerView}>
      {weeks.map((week, i) => (
        <View key={i} style={styles.page}>
          <View style={styles.row}>
            {week.map((day, j) => {
              const txt = format(day, 'EEE');
              const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
              return (
                <TouchableOpacity
                  key={j}
                  style={[styles.day, isSelected && styles.selectedDay]}
                  onPress={() => handleDayPress(day)}
                >
                  <Text style={[styles.text, isSelected && styles.selectedText]}>{txt}</Text>
                  <View style={[styles.numberContainer, isSelected && styles.selectedNumberContainer]}>
                    <Text style={styles.number}>{day.getDate()}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </PagerView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    height: 300, // Establecemos una altura fija para el calendario
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  day: {
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
  },
  selectedDay: {
    backgroundColor: '#ADD8E6',
  },
  text: {
    fontSize: 16,
  },
  selectedText: {
    fontWeight: 'bold',
  },
  numberContainer: {
    borderWidth: 1, // Añade el borde alrededor del número
    borderRadius: 20, // Redondea el contenedor del número
    width: 40, // Establece un ancho fijo para el contenedor del número
    height: 40, // Establece una altura fija para el contenedor del número
    justifyContent: 'center', // Centra el número verticalmente
    alignItems: 'center', // Centra el número horizontalmente
    margin: 5, // Ajusta el margen entre los números
  },
  selectedNumberContainer: {
    borderColor: '#000', // Color del borde seleccionado
  },
  number: {
    fontSize: 16,
  },
});

export default CalendarComponent;
