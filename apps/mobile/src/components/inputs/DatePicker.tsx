import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import React from "react";
import { Platform, Pressable, Text, useColorScheme, View } from "react-native";
import Colors from "@/constants/Colors";

type Props = {
  value: string; // ✅ accept string now
  onChange: (val: string) => void; // ✅ output string
  onBlur?: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
};

const DatePickerComponent: React.FC<Props> = ({
  value,
  onChange,
  onBlur,
  minimumDate,
  maximumDate,
}) => {
  const colorScheme = useColorScheme();
  const [showPicker, setShowPicker] = React.useState(false);

  // Safely convert string -> Date for display
  const parsedDate = value ? new Date(value) : new Date();

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (event.type === "set" && selectedDate) {
      onChange(selectedDate.toISOString()); // ✅ output string
    }
    onBlur?.();
  };

  return (
    <View className="h-14 w-[90%] mx-auto bg-base-200 rounded-md justify-center">
      <Pressable onPress={() => setShowPicker(true)} className="px-4 py-2">
        <Text
          style={{
            color: Colors[colorScheme ?? "light"]["secondary-content"],
          }}
        >
          {value
            ? format(parsedDate, "dd MMM yyyy")
            : "Select Date"}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          mode="date"
          value={parsedDate}
          onChange={handleChange}
          display={Platform.OS === "ios" ? "inline" : "default"}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export default DatePickerComponent;
