import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { denormalizeDate, normalizeDate } from "@/utils/normalizeDate";
import CropperComponent from "../image/upload-image";
import { Checkbox } from "../ui/checkbox";
import { DatePicker } from "../ui/date-picker";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { MultiSelect, type Option } from "../ui/multiselect";
import { SingleSelect } from "../ui/select";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
export interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  type?: string;
  label: string;
  name: Path<T>;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  section?: string;
  error?: string;
  onChangeValue?: (value: string | undefined | null) => void;
  options?: Option[] | undefined;
  component:
    | "input"
    | "multiselect"
    | "select"
    | "checkbox"
    | "textarea"
    | "calendar"
    | "image";
}

export const FormField = <T extends FieldValues>({
  control,
  type,
  label,
  name,
  placeholder,
  className,
  required = true,
  disabled = false,
  section,
  loading = false,
  error,
  options,
  component,
  onChangeValue,
  ...props
}: FormFieldProps<T>) => {
  return (
    <div>
      <Label htmlFor={name} className="mb-2 gap-0">
        {label}
        {required && <span className="text-red-500 ">*</span>}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => {
          switch (component) {
            case "input": {
              return (
                <Input
                  disabled={disabled}
                  type={type}
                  name={name}
                  className={`h-[41px] ${className}`}
                  placeholder={placeholder}
                  onChange={(e) =>
                    onChange(
                      type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                    )
                  }
                  onBlur={onBlur}
                  value={value}
                  {...props}
                />
              );
            }
            case "multiselect": {
              if (loading)
                return (
                  <div className="">
                    <MultiSelect
                      options={options}
                      // defaultValues={
                      //   Array.isArray(value)
                      //     ? options?.filter((opt) => value.includes(opt.value))
                      //     : []
                      // }
                      // onChange={(selected) =>
                      //   onChange(selected.map((s) => s.value))
                      // }
                    />
                    <Spinner />
                  </div>
                );
              return (
                <MultiSelect
                  options={options}
                  defaultValues={
                    Array.isArray(value)
                      ? options?.filter((opt) => value.includes(opt.value))
                      : []
                  }
                  onChange={(selected) =>
                    onChange(selected.map((s) => s.value))
                  }
                />
              );
            }

            case "select":
              return (
                <SingleSelect
                  isDisabled={disabled}
                  options={options}
                  className="h-12"
                  value={options?.find((item) => item.value === value) || null}
                  onChange={(selectedItem) => onChange(selectedItem?.value)}
                  {...props}
                />
              );
            case "checkbox":
              return (
                <div className="flex gap-3 flex-wrap">
                  {options?.map((option) => (
                    <div key={option.value.toString()} className="">
                      <div
                        key={option.value.toString()}
                        className="flex items-center gap-2 "
                      >
                        <div className="mt-1 flex items-center justify-center">
                          <Checkbox
                            className="border-gray-300"
                            checked={
                              Array.isArray(value) &&
                              value.includes(option.value)
                            }
                            onCheckedChange={(checked) => {
                              console.log({ value });
                              if (checked) {
                                onChange([...(value || []), option.value]);
                              } else {
                                onChange(
                                  value?.filter(
                                    (val: string) => val !== option.value,
                                  ),
                                );
                              }
                            }}
                          />
                        </div>
                        {/* <div className=""> */}
                        <label htmlFor="" className="text-sm text-gray-700">
                          {option.label}
                        </label>
                        {/* </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              );

            case "textarea":
              return <Textarea value={value} onChange={onChange} />;

            case "calendar":
              return (
                <DatePicker
                  value={denormalizeDate(value)}
                  onChange={(e) => {
                    console.log(e);
                    onChange(normalizeDate(e));
                  }}
                />
              );
            case "image":
              return <CropperComponent onChange={onChange} value={value} />;
            default:
              return <div>no component</div>;
          }
        }}
      />

      {/* for error */}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};
