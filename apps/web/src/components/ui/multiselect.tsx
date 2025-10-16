import type React from "react";
import Select, { type StylesConfig } from "react-select";

export interface Option {
  label: string;
  value: number | string;
}

interface MultiSelectProps {
  options: Option[] | undefined;
  defaultValues?: Option[];
  onChange?: (selected: Option[]) => void;
}

const multiSelectStyles: StylesConfig<Option, true> = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isSelected
        ? "#e6f7ff"
        : isFocused
          ? "#f5f5f5"
          : undefined,
      color: "black",
      cursor: "default",
      ":active": {
        ...styles[":active"],
        backgroundColor: isSelected ? "#e6f7ff" : "#f0f0f0",
      },
    };
  },
  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor: "#f0f0f0",
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: "#333",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "#999",
    ":hover": {
      backgroundColor: "#ccc",
      color: "white",
    },
  }),
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  defaultValues,
  onChange,
}) => {
  return (
    <Select
      closeMenuOnSelect={false}
      isMulti
      options={options}
      defaultValue={defaultValues}
      onChange={(selected) => onChange?.(selected as Option[])}
      styles={multiSelectStyles}
    />
  );
};
