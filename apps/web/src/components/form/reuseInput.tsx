import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";

export function InputField({ name, label, type, required, ...rest }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message;
  return (
    <div className={`input-wrapper ${error ? "has-error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <Input
        type={type || "text"}
        {...register(name, { required: required })}
        {...rest}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
