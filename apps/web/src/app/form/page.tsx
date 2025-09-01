import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "@/components/form/reuseInput";

export default function MyForm() {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <InputField
        name="name"
        label="Name"
        placeholder="Enter your name"
        required="Name is required"
      />
      <InputField
        name="email"
        label="Email"
        placeholder="Enter your email"
        type="email"
        required="Email is required"
      />
    </FormProvider>
  );
}
