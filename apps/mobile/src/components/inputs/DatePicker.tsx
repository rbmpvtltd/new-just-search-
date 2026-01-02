import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import React from "react";
import { Platform, Pressable, Text, useColorScheme, View } from "react-native";
import Colors from "@/constants/Colors";

type Props = {
  value: string; // ISO string OR "20:30"
  onChange: (val: string) => void; // store ISO string
  onBlur?: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
  mode: "date" | "time";
  className?: string;
};

const DatePickerComponent: React.FC<Props> = ({
  value,
  onChange,
  onBlur,
  minimumDate,
  maximumDate,
  className,
  mode,
}) => {
  const colorScheme = useColorScheme();
  const [showPicker, setShowPicker] = React.useState(false);

  const parsedDate = React.useMemo(() => {
    if (!value) return new Date();
    return mode === "time" ? timeStringToDate(value) : new Date(value);
  }, [value, mode]);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);

    if (event.type === "set" && selectedDate) {
      if (mode === "time") {
        onChange(dateTo24HourString(selectedDate)); // ✅ STORE "HH:mm"
      } else {
        onChange(format(selectedDate, "yyyy-MM-dd")); // optional for date
      }
    }

    onBlur?.();
  };

  const formattedValue = React.useMemo(() => {
    if (!value) return mode === "time" ? "Select Time" : "Select Date";

    if (mode === "time") {
      return to12HourFormat(value);
    }

    return format(new Date(value), "dd MMM yyyy");
  }, [value, mode]);

  return (
    <View
      className={`${className} h-14 w-[90%] mx-auto bg-base-200 rounded-md justify-center items-center`}
    >
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
          is24Hour={false}
        />
      )}
    </View>
  );
};

/**
 * Converts ISO string OR "20:30" → Date
 */
function timeStringToDate(value: string) {
  // ISO string
  if (value.includes("T")) {
    return new Date(value);
  }

  // "20:30"
  const [h, m] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date;
}

/**
 * Converts ISO string OR "20:30" → "08:30 pm"
 */
function to12HourFormat(value: string) {
  let date: Date;

  if (value.includes("T")) {
    date = new Date(value);
  } else {
    const [h, m] = value.split(":").map(Number);
    date = new Date();
    date.setHours(h, m, 0, 0);
  }

  return format(date, "hh:mm a");
}

function dateTo24HourString(date: Date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default DatePickerComponent;
