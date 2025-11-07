import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import React from "react";
import { Platform, Pressable, Text, useColorScheme, View } from "react-native";
import Colors from "@/constants/Colors";

type Props = {
  value: string; // store ISO string
  onChange: (val: string) => void;
  onBlur?: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
  mode: "date" | "time";
};

const DatePickerComponent: React.FC<Props> = ({
  value,
  onChange,
  onBlur,
  minimumDate,
  maximumDate,
  mode,
}) => {
  const colorScheme = useColorScheme();
  const [showPicker, setShowPicker] = React.useState(false);

  const parsedDate = value ? new Date(value) : new Date();

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (event.type === "set" && selectedDate) {
      onChange(selectedDate.toISOString());
    }
    onBlur?.();
  };

  // 👉 Format value dynamically based on mode
  const formattedValue = React.useMemo(() => {
    if (!value) return mode === "time" ? "Select Time" : "Select Date";
    if (mode === "time") {
      return format(parsedDate, "hh:mm a"); // e.g. "03:45 PM"
    }
    return format(parsedDate, "dd MMM yyyy"); // e.g. "03 Nov 2025"
  }, [value, mode, parsedDate]);

  return (
    <View className="h-14 w-[90%] mx-auto bg-base-200 rounded-md justify-center">
      <Pressable onPress={() => setShowPicker(true)} className="px-4 py-2">
        <Text
          style={{
            color: Colors[colorScheme ?? "light"]["secondary-content"],
          }}
        >
          {formattedValue}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          mode={mode}
          value={parsedDate}
          onChange={handleChange}
          display={Platform.OS === "ios" ? "inline" : "default"}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          is24Hour={false} // ✅ show AM/PM for time
        />
      )}
    </View>
  );
};

export default DatePickerComponent;
