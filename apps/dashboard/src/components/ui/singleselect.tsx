"use client";

import Select, {
  type Props as SelectProps,
  type StylesConfig,
} from "react-select";
import type { Option } from "./multiselect";

const selectStyles: StylesConfig<Option, false> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderRadius: "0.5rem",
    borderColor: "#e5e7eb", // gray-200
    padding: "2px 4px",
    minHeight: "40px",
    boxShadow: "none",
    ":hover": { borderColor: "#d1d5db" }, // gray-300
  }),
  menu: (styles) => ({
    ...styles,
    borderRadius: "0.5rem",
    zIndex: 50,
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "#f97316" // orange-500
      : isFocused
        ? "#fff7ed" // orange-50
        : undefined,
    color: isSelected ? "white" : "#374151", // gray-700
    cursor: "pointer",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#9ca3af", // gray-400
  }),
};

export function SingleSelect(props: SelectProps<Option, false>) {
  return <Select {...props} styles={selectStyles} />;
}
