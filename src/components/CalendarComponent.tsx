import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Importamos el locale de español directamente

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Establecemos la fecha seleccionada como hoy al cargar el componente
    setSelectedDate(new Date());
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.monthContainer}>
        <View style={styles.monthTextContainer}>
          <Text style={styles.monthText}>
            {format(selectedDate, 'MMMM yyyy', { locale: es }).toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          current={format(selectedDate, 'yyyy-MM-dd')} // Cambiamos current
          hideExtraDays
          markedDates={{
            [format(selectedDate, 'yyyy-MM-dd')]: { selected: true, marked: true, dotColor: 'black' },
          }}
          theme={{
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#c3d0f6',
            selectedDayTextColor: '#333333',
            todayTextColor: '#333333',
            dayTextColor: '#333333',
            textDisabledColor: '#d9e1e8',
            arrowColor: '#333333',
            monthTextColor: '#333333',
            textDayFontFamily: 'Montserrat-Regular',
            textMonthFontFamily: 'Montserrat-Bold',
            textDayHeaderFontFamily: 'Montserrat-Medium',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  monthContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  monthTextContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 3,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default CalendarComponent;