import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
export interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  type: string;
  label: string;
  name: Path<T>;
  placeholder?: string;
  className?: string;
  error?: string;
  component: "input";
}

export const FormField = <T extends FieldValues>({
  control,
  type,
  label,
  name,
  placeholder,
  className,
  error,
  component,
  ...props
}: FormFieldProps<T>) => {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => {
          switch (component) {
            case "input":
              return (
                <Input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  {...props}
                />
              );

            default:
              return <></>;
          }
        }}
      />

      {/* for error */}
      {error && <div>{error}</div>}
    </div>
  );
};
