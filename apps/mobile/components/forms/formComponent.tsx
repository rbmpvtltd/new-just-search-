import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Switch,
  useColorScheme,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { Checkbox, Text } from "react-native-paper";
import Colors from "@/constants/Colors";
import { pickImage } from "@/lib/imagePicker";
import Editor from "../dom-components/hello-dom";
import DatePickerComponent from "../inputs/DatePicker";
import DropdownComponent, { type Option } from "../inputs/Dropdown";
import Input from "../inputs/Input";
import LableText from "../inputs/LableText";
import MultiSelectDropdown from "../inputs/MultiSelectDropdown";
import TextAreaInput from "../inputs/TextAreaInput";
import ErrorText from "../ui/ErrorText";
import TimePickerField from "../ui/TimePickerField";

export interface FormFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address";
  onBlurEvent?: (value: string | undefined | null) => void;
  onValueChange?: (value: string | undefined | null) => void;
  error?: string;
  component:
    | "input"
    | "dropdown"
    | "datepicker"
    | "image"
    | "checkbox"
    | "multiselectdropdown"
    | "switch"
    | "editor"
    | "textarea"
    | "timepicker";
  data?: Option[] | undefined;
  className?: string;
  labelHidden?: boolean;
  multiselect?: number;
  dropdownPosition?: "bottom" | "auto" | "top";
  fileSize?: number;
  editable?: boolean;
  disable?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  onValueChange,
  keyboardType,
  error,
  component,
  data,
  className,
  labelHidden = false,
  multiselect,
  dropdownPosition,
  fileSize = 2,
  editable = true,
  disable = false,
  ...props
}) => {
  const colorScheme = useColorScheme();
  // const [editorState, setEditorState] = useState<string | null>(null);
  const [_, setPlainText] = useState("");
  return (
    <>
      {!labelHidden && <LableText title={label} />}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => {
          switch (component) {
            case "input":
              return (
                <Input
                  className={`mx-auto text-secondary ${className}`}
                  placeholder={placeholder}
                  keyboardType={keyboardType}
                  onBlur={() => {
                    onBlur();
                    if (props.onBlurEvent) {
                      props.onBlurEvent(value as string);
                    }
                  }}
                  onChangeText={(value) => {
                    if (onValueChange) {
                      onValueChange(value);
                    }
                    onChange(value);
                  }}
                  value={value as string}
                  editable={editable}
                />
              );
            case "dropdown":
              if (data) {
                return (
                  <DropdownComponent
                    value={value as string}
                    className={className}
                    onChange={onChange}
                    onBlur={onBlur}
                    data={data}
                    dropdownPosition={dropdownPosition}
                    placeholder={placeholder}
                    disable={disable}
                  />
                );
              } else {
                return null;
              }

            case "datepicker":
              return (
                <DatePickerComponent
                  value={value as Date}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              );
            case "image":
              return (
                <View className={`items-center w-30 h-30  ${className}`}>
                  <Pressable
                    onPress={async () => {
                      Alert.alert("Pick File From", "  ", [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "camera",
                          onPress: async () => {
                            const uri = await pickImage(true, fileSize);
                            onChange(uri);
                          },
                        },
                        {
                          text: "gallery",
                          onPress: async () => {
                            const uri = await pickImage(false, fileSize);
                            onChange(uri);
                          },
                        },
                      ]);
                    }}
                    style={{
                      width: 135,
                      height: 135,
                      borderRadius: 12,
                      borderStyle: "dashed",
                      borderColor: Colors[colorScheme ?? "light"]["base-300"],
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        Colors[colorScheme ?? "light"]["base-200"],
                    }}
                  >
                    {value ? (
                      <Image
                        source={{ uri: value }}
                        className="w-full h-full rounded-xl border border-secondary"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="justify-center items-center">
                        <Ionicons
                          name="image-outline"
                          size={32}
                          color={Colors[colorScheme ?? "light"]["secondary"]}
                        />
                        <Text
                          className="text-sm mt-2"
                          style={{
                            color: Colors[colorScheme ?? "light"]["secondary"],
                          }}
                        >
                          Select Image
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </View>
              );

            case "checkbox":
              return (
                <View className="space-y-2">
                  {(data || []).map((item) => {
                    const isChecked = (value || []).includes(item.value);
                    return (
                      <Checkbox.Item
                        labelStyle={{
                          color: Colors[colorScheme ?? "light"]["secondary"],
                        }}
                        key={item.value}
                        label={item.label ? item.label : ""}
                        status={isChecked ? "checked" : "unchecked"}
                        onPress={() => {
                          if (isChecked) {
                            onChange(
                              value.filter((v: string) => v !== item.value),
                            );
                          } else {
                            onChange([...(value || []), item.value]);
                          }
                        }}
                      />
                    );
                  })}
                </View>
              );
            case "multiselectdropdown":
              return (
                <MultiSelectDropdown
                  value={value || []}
                  onChange={onChange}
                  data={data || []}
                  placeholder={placeholder}
                  multiselect={multiselect}
                  dropdownPosition={dropdownPosition}
                />
              );
            case "switch":
              return (
                <View className="flex-row items-center justify-between my-2">
                  <Text>{label}</Text>
                  <Switch
                    value={Boolean(value)}
                    onValueChange={onChange}
                    trackColor={{
                      false: "#767577",
                      true: Colors[colorScheme ?? "light"]["secondary"],
                    }}
                    thumbColor={
                      value
                        ? Colors[colorScheme ?? "light"]["primary"]
                        : "#f4f3f4"
                    }
                  />
                </View>
              );
            case "editor":
              return (
                <ScrollView className="flex-1">
                  <View style={{ height: 270 }}>
                    {Platform.OS !== "web" ? (
                      <Editor
                        value={value}
                        onChange={(text: string) => {
                          onChange(text); // ✅ send to react-hook-form
                          // if (onValueChange) onValueChange(text);
                        }}
                        setPlainText={setPlainText}
                        // setEditorState={setEditorState}
                      />
                    ) : null}
                  </View>
                </ScrollView>
              );

            case "textarea":
              return (
                <TextAreaInput
                  placeholder={placeholder}
                  customStyle={{
                    borderColor: error
                      ? "red"
                      : Colors[colorScheme ?? "light"]["base-300"],
                  }}
                  className={`text-secondary ${className}`}
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    if (onValueChange) {
                      onValueChange(value);
                    }
                    onChange(value);
                  }}
                  value={value as string}
                />
              );

            case "timepicker":
              return (
                <TimePickerField
                  value={value}
                  onChange={(time) => {
                    if (onValueChange) onValueChange(time);
                    onChange(time);
                  }}
                />
              );
            default:
              return <></>;
          }
        }}
      />
      {component !== "timepicker" && error && <ErrorText title={error} />}
    </>
  );
};
