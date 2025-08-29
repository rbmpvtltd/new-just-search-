import React from "react";
import { View, Platform, Pressable, Text } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { format } from "date-fns";

type Props = {
  value: Date;
  onChange: (val: Date) => void;
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

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (event.type === "set" && selectedDate) {
      onChange(selectedDate);
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
          {format(value, "dd MMM yyyy")}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          mode="date"
          value={value}
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
