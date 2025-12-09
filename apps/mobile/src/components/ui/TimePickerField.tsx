import React, { useState } from "react";
import { View, Text, Platform, useColorScheme,Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from "@/constants/Colors";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const TimePickerField: React.FC<Props> = ({ value, onChange }) => {
  const [show, setShow] = useState(false);
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHour = (((hours + 11) % 12) + 1)
        .toString()
        .padStart(2, "0");
      const formattedMinute = minutes.toString().padStart(2, "0");
      const timeString = `${formattedHour}:${formattedMinute} ${period}`;
      onChange(timeString);
    }
  };

  return (
    <View>
      <Pressable
        onPress={() => setShow(true)}
        style={{
          backgroundColor: themeColors["base-200"],
          borderColor: themeColors["base-300"],
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginTop: 8,
        }}
        // className="border border-base-300 rounded-md px-4 py-3"
      >
        <Text style={{ color: themeColors["base-300"] }}>
          {value || "Select Time"}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          value={new Date()}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default TimePickerField;
