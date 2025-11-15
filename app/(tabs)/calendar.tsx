import { View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarScreen() {
  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <Calendar onDayPress={(day) => console.log(day)} markingType={"dot"} />
    </View>
  );
}
