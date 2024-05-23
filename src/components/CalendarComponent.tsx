import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { format } from 'date-fns';

interface CalendarComponentProps {
  selectedDate: Date | null;
  onDayPress: (day: Date) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ selectedDate, onDayPress }) => {
  const [weeks, setWeeks] = useState<Date[][]>([]);

  const generateWeeks = () => {
    const today = new Date();
    const startOfCurrentWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());

    const generatedWeeks = [];
    for (let i = 0; i < 3; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        const day = new Date(startOfCurrentWeek.getFullYear(), startOfCurrentWeek.getMonth(), startOfCurrentWeek.getDate() + i * 7 + j);
        week.push(day);
      }
      generatedWeeks.push(week);
    }

    setWeeks(generatedWeeks);
  };

  useEffect(() => {
    generateWeeks();
  }, []);

  const handleDayPress = (day: Date) => {
    onDayPress(day);
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
    height: 300,
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
    borderWidth: 1,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  selectedNumberContainer: {
    borderColor: '#000',
  },
  number: {
    fontSize: 16,
  },
});

export default CalendarComponent;
