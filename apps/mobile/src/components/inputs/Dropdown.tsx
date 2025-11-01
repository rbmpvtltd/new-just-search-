import React from "react";
import { useColorScheme, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Colors from "@/constants/Colors";

export type Option = {
  label: string | number;
  value: string | number;
};

interface Props {
  value: string | null;
  onChange: (value: string) => void;
  onBlur?: () => void;
  data: Option[];
  placeholder?: string;
  className?: string;
  dropdownPosition?: "bottom" | "auto" | "top";
  disable?: boolean;
}

export default function DropdownComponent({
  value,
  onChange,
  onBlur,
  data,
  placeholder = "Select item",
  className = "",
  dropdownPosition = "bottom",
  disable = false,
}: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const borderColor = Colors[colorScheme ?? "light"]["base-200"];

  return (
    <View className={`mx-auto w-[90%] ${className}`}>
      <Dropdown
        style={{
          height: 50,
          paddingHorizontal: 10,
          borderRadius: 8,
          borderColor: borderColor,
          backgroundColor: theme["base-200"],
        }}
        placeholderStyle={{
          fontSize: 16,
          color: theme["base-300"],
        }}
        selectedTextStyle={{
          fontSize: 16,
          color: theme.secondary,
        }}
        inputSearchStyle={{
          height: 40,
          fontSize: 14,
          color: theme.secondary,
        }}
        iconStyle={{
          width: 20,
          height: 20,
        }}
        itemTextStyle={{
          fontSize: 16,
          color: theme.secondary,
        }}
        activeColor={theme["base-200"]}
        containerStyle={{
          backgroundColor: theme["base-100"],
          borderRadius: 8,
        }}
        itemContainerStyle={{
          backgroundColor: theme["base-100"],
        }}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        search
        searchPlaceholder="Search here..."
        maxHeight={300}
        value={value}
        onChange={(item) => onChange(item.value)}
        onBlur={onBlur}
        dropdownPosition={dropdownPosition}
        autoScroll={false}
        disable={disable}
      />
    </View>
  );
}
