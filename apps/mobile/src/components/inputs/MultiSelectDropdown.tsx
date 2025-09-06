import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Text, useColorScheme, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import Colors from "@/constants/Colors";

type Option = {
  label: string;
  value: string;
};

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  data: Option[];
  placeholder?: string;
  className?: string;
  multiselect?: number;
  dropdownPosition?: "bottom" | "auto" | "top";
}

export default function MultiSelectDropdown({
  value,
  onChange,
  data,
  placeholder = "Select items",
  className = "",
  multiselect,
  dropdownPosition = "top",
}: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const renderItem = (item: Option) => {
    const isSelected = value.includes(item.value || "");
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          justifyContent: "space-between",
          backgroundColor: theme["base-100"],
        }}
      >
        <Text style={{ fontSize: 16, color: theme.secondary }}>
          {item.label}
        </Text>
        {isSelected && (
          <AntDesign name="Safety" size={20} color={theme.primary} />
        )}
      </View>
    );
  };

  return (
    <View className={`mx-auto w-[90%] ${className}`}>
      <MultiSelect
        style={{
          height: 50,
          paddingHorizontal: 10,
          borderRadius: 8,
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
          fontSize: 16,
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
        selectedStyle={{
          borderRadius: 12,
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
        value={value}
        onChange={(val) => onChange(val)}
        maxSelect={multiselect}
        dropdownPosition={dropdownPosition}
        showsVerticalScrollIndicator
        renderItem={renderItem}
      />
    </View>
  );
}
