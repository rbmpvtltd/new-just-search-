import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { Ionicons } from "@expo/vector-icons";
import { AdvancedImage } from "cloudinary-react-native";
import { useState } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  useColorScheme,
  View,
} from "react-native";
import { Checkbox, Text } from "react-native-paper";
import Colors from "@/constants/Colors";
import { cld } from "@/lib/cloudinary";
import { pickImage } from "@/lib/imagePicker";
import Editor from "../dom-components/hello-dom";
import DatePickerComponent from "../inputs/DatePicker";
import DropdownComponent, { type Option } from "../inputs/Dropdown";
import Input from "../inputs/Input";
import LableText from "../inputs/LableText";
import MultiSelectDropdown from "../inputs/MultiSelectDropdown";
import TextAreaInput from "../inputs/TextAreaInput";
import ErrorText from "../ui/ErrorText";
import { Loading } from "../ui/Loading";
import TimePickerField from "../ui/TimePickerField";

export interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: "text" | "number";
  keyboardType?: "default" | "numeric" | "email-address";
  onBlurEvent?: (value: string | undefined | null) => void;
  onValueChange?: (value: string | number | undefined | null) => void;
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
  required?: boolean;
  multiselect?: number;
  dropdownPosition?: "bottom" | "auto" | "top";
  fileSize?: number;
  editable?: boolean;
  disable?: boolean;
  isLoading?: boolean;
  mode?: "date" | "time";
}

export const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  onValueChange,
  keyboardType,
  error,
  type,
  component,
  data,
  className,
  labelHidden = false,
  required = true,
  multiselect,
  dropdownPosition,
  fileSize = 2,
  editable = true,
  disable = false,
  isLoading = false,
  mode,
  ...props
}: FormFieldProps<T>) => {
  const colorScheme = useColorScheme();
  const [_, setPlainText] = useState("");
  return (
    <>
      <View className="flex-row items-center ml-3">
        {!labelHidden && <LableText title={label} />}
        {required && (
          <Text style={{ color: "red" }} className="ml-1 mt-2">
            *
          </Text>
        )}
      </View>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          switch (component) {
            case "input": {
              return (
                <Input
                  ref={ref}
                  className={`${className} w-[90%] m-auto`}
                  placeholder={placeholder}
                  keyboardType={keyboardType}
                  onBlur={() => {
                    onBlur();
                    if (props.onBlurEvent) props.onBlurEvent(value);
                  }}
                  onChangeText={(text) => {
                    onChange(type === "number" ? Number(text) : text);
                    if (onValueChange) onValueChange(text);
                  }}
                  value={value?.toString() ?? ""}
                  editable={editable}
                />
              );
            }
            case "dropdown":
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

            case "datepicker": {
              return (
                <DatePickerComponent
                  className={className}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  mode={mode || "date"}
                />
              );
            }
            case "image": {
              let cloudinaryImage: any;
              if (value && !value.startsWith("file:")) {
                console.log("Value", value);

                cloudinaryImage = cld
                  .image(value)
                  .resize(
                    thumbnail()
                      .width(150)
                      .height(150)
                      .gravity(focusOn(FocusOn.face())),
                  )
                  .roundCorners(byRadius(20));
              }

              return (
                <View className={`items-center w-30 h-30   ${className}`}>
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

                            onChange(uri?.imageUri);
                          },
                        },
                        {
                          text: "gallery",
                          onPress: async () => {
                            const uri = await pickImage(false, fileSize);
                            console.log("uri", uri);
                            onChange(uri?.imageUri);
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
                    className="border"
                  >
                    {value ? (
                      value.startsWith("file") ? (
                        <Image
                          source={{ uri: value }}
                          className="w-full h-full rounded-xl border border-secondary"
                          resizeMode="cover"
                        />
                      ) : cloudinaryImage ? (
                        <View
                          style={{
                            width: 135,
                            height: 135,
                            borderColor:
                              Colors[colorScheme ?? "light"]["secondary"],
                          }}
                        >
                          <AdvancedImage
                            cldImg={cloudinaryImage}
                            style={{
                              width: "100%",
                              height: "100%",
                              resizeMode: "cover",
                            }}
                          />
                        </View>
                      ) : (
                        <ActivityIndicator
                          size="small"
                          color={Colors[colorScheme ?? "light"]["secondary"]}
                        />
                      )
                    ) : (
                      <View className="justify-center items-center ">
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
                          {placeholder}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </View>
              );
            }
            case "checkbox":
              return (
                <View className="space-y-2">
                  {(data || []).map((item) => {
                    if (!item.value) return null;
                    const isChecked = (value || []).includes(
                      item?.value as never,
                    );
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
                              value?.filter((v: string) => v !== item.value),
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
                <>
                  <MultiSelectDropdown
                    value={value || []}
                    onChange={onChange}
                    data={(data as any) ?? []}
                    placeholder={placeholder}
                    multiselect={multiselect}
                    dropdownPosition={dropdownPosition}
                  />
                  {isLoading && <Loading position="center" />}
                </>
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
                <ScrollView
                  className="flex-1"
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
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
                  value={value ?? ""}
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
