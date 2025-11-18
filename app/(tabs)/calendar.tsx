import { useNotes } from "@/stores/useNote";
import { Note } from "@/types/note";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { NoteCard } from "./components/noteCard";

type MarkedDates = {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
};

export default function CalendarScreen() {
  const { notes, load } = useNotes();
  const [selectedDate, setSelectedDate] = useState("");
  const [eventsOfDay, setEventsOfDay] = useState<Note[]>([]);

  useEffect(() => {
    load();
  }, [load]);

  const markedDates: MarkedDates = notes
    .filter((n) => n.type === "event" && n.date)
    .reduce((acc: MarkedDates, event) => {
      const date = event.date!.split("T")[0];
      acc[date] = {
        marked: true,
        dotColor: "#007AFF",
      };
      return acc;
    }, {});

  function handleDayPress(day: any) {
    const date = day.dateString;
    setSelectedDate(date);

    const events = notes.filter(
      (n) => n.type === "event" && n.date && n.date.startsWith(date)
    );

    setEventsOfDay(events);
  }

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...markedDates,
          ...(selectedDate
            ? {
                [selectedDate]: {
                  selected: true,
                  selectedColor: "#007AFF",
                  marked: markedDates[selectedDate]?.marked,
                  dotColor: "#fff",
                },
              }
            : {}),
        }}
        markingType="dot"
      />

      <ScrollView style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
          Eventos do dia
        </Text>

        {eventsOfDay.length === 0 && (
          <Text style={{ color: "#666" }}>Nenhum evento neste dia.</Text>
        )}

        {eventsOfDay.map((event) => (
          <NoteCard
            key={event.id}
            note={{
              ...event,
              date: event.date
                ? new Date(event.date).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : undefined,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
