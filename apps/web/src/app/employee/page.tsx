"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  emptyToUndefined,
  type FieldDataType,
  FieldType,
  FormGenerator,
} from "@/components/form/form-generator";

// Define form fields
const formFields: FieldDataType[] = [
  {
    name: "name",
    label: "Full Name",
    type: FieldType.Text,
    default: "",
    description: "Enter your full name.",
    required: true,
    schema: z.string().min(1, "Name is required"),
  },
  {
    name: "email",
    label: "Email",
    type: FieldType.Text,
    default: "",
    description: "Enter your email.",
    required: true,
    schema: z.string().email("Invalid email address"),
  },
  {
    name: "age",
    label: "Age",
    type: FieldType.Number,
    default: 0,
    description: "Enter your age.",
    required: true,
    schema: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .refine((val) => !isNaN(Number(val)), {
          message: "Age must be a number",
        })
        .transform(Number),
    ),
  },
  {
    name: "salary",
    label: "Salary",
    type: FieldType.Number,
    default: 0,
    description: "Enter your salary.",
    required: false,
    schema: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined)),
    ),
  },
] as const;

function Form() {
  const generator = new FormGenerator<typeof formFields>(formFields);
  const schema = z.object(generator.schema);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: generator.defaultValues,
  });

  return (
    <form
      className="flex w-full flex-col gap-5 px-5 py-8"
      onSubmit={form.handleSubmit((data) => console.log("Form data:", data))}
    >
      <h1 className="text-2xl font-bold">User Info Form</h1>
      <div className="grid w-full gap-x-3 md:grid-cols-2">
        {generator.fields(form)}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="w-60 bg-blue-500 text-white py-2 rounded"
        >
          SAVE
        </button>
      </div>
    </form>
  );
}

export default Form;
