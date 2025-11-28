import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import CropperComponent from "../image/upload-image";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { MultiSelect, type Option } from "../ui/multiselect";
import { SingleSelect } from "../ui/singleselect";
import { Textarea } from "../ui/textarea";
export interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  type?: string;
  label: string;
  name: Path<T>;
  placeholder?: string;
  className?: string;
  mainDivClassName?: string;
  required?: boolean;
  section?: string;
  error?: string;
  options?: Option[] | undefined;
  component:
    | "input"
    | "input-slug"
    | "multiselect"
    | "select"
    | "checkbox"
    | "single-checkbox"
    | "textarea"
    | "image";
}

export const FormField = <T extends FieldValues>({
  control,
  type,
  label,
  name,
  placeholder,
  className,
  mainDivClassName,
  required = true,
  section,
  error,
  options,
  component,
  ...props
}: FormFieldProps<T>) => {
  return (
    <div className={mainDivClassName}>
      <Label htmlFor={name} className="mb-2 gap-0">
        {label}
        {required && <span className="text-red-500 ">*</span>}
      </Label>
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
                  className={className}
                  placeholder={placeholder}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  {...props}
                />
              );

            case "input-slug":
              return (
                <div>
                  <Input
                    type={type}
                    name={name}
                    className={className}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    {...props}
                  />
                </div>
              );

            case "multiselect":
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

            case "select":
              return (
                <SingleSelect
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
                    <div key={String(option.value)} className="">
                      <div
                        key={String(option.value)}
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

            case "single-checkbox":
              return (
                <Checkbox
                  className="inline border-gray-300"
                  name={name}
                  checked={value}
                  id={name}
                  onCheckedChange={onChange}
                />
              );

            case "textarea":
              return <Textarea />;

            case "image":
              return <CropperComponent onChange={onChange} value={value} />;

            default:
              return <div>no component</div>;
          }
        }}
      />

      {/* for error */}
      {error && <div>{error}</div>}
    </div>
  );
};
