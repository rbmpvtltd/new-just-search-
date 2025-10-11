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
  required?: boolean;
  section?: string;
  error?: string;
  options?: Option[] | undefined;
  component:
    | "input"
    | "multiselect"
    | "select"
    | "checkbox"
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
  required = true,
  section,
  error,
  options,
  component,
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

            case "multiselect":
              return <MultiSelect options={options} />;

            case "select":
              return <SingleSelect options={options} />;
            case "checkbox":
              return (
                <div className="flex gap-3 flex-wrap">
                  {options?.map((i) => (
                    <div key={i.value} className="">
                      <div key={i.value} className="flex items-center gap-2 ">
                        <div className="mt-1 flex items-center justify-center">
                          <Checkbox
                            className="border-gray-300"
                            key={i.value}
                            name={name}
                            value={value}
                            onChange={onChange}
                          />
                        </div>
                        <div className="">
                          <label htmlFor="" className="text-sm text-gray-700">
                            {i.label}
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
