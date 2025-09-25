"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	emptyToNull,
	emptyToUndefined,
	type FieldDataType,
	FieldType,
	FormGenerator,
} from "@/components/form/form-generator";
import { Button } from "@/components/ui/button";

const formFields: FieldDataType[] = [
	{
		name: "name",
		label: "Name",
		type: FieldType.Text,
		default: "",
		required: true,
		schema: z.preprocess(emptyToUndefined, z.string()),
	},
	{
		name: "department",
		label: "Department",
		type: FieldType.Select,
		default: undefined,
		required: true,
		schema: z.string(),
		options: ["IT", "Sales", "Marketing", "Finance"],
	},
	{
		name: "salary",
		label: "Salary",
		type: FieldType.Number,
		default: 0,
		required: false,
		schema: z.preprocess(emptyToNull, z.number().nullable()),
	},
	{
		name: "isActive",
		label: "Is Active",
		type: FieldType.Checkbox,
		default: true,
		required: false,
		schema: z.boolean(),
	},
	{
		name: "dateOfEmployment",
		label: "Date of Employment",
		type: FieldType.DatePicker,
		default: new Date(),
		required: true,
		schema: z.date(),
	},
	{
		name: "notes",
		label: "Notes",
		type: FieldType.Textarea,
		default: "",
		required: false,
		schema: z.preprocess(emptyToNull, z.string().nullable()),
	},
] as const;

export default function MyForm() {
	const formGenerator = new FormGenerator<typeof formFields>(formFields);

	const schema = z.object(formGenerator.schema);
	type FormSchemaType = z.infer<typeof schema>;

	const defaultValues = formGenerator.defaultValues;

	const form = useForm<FormSchemaType>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues,
	});

	const onSubmit = (data: FormSchemaType) => {
		console.log(data);
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			{formGenerator.fields(form)}
			<Button type="submit">Submit</Button>
		</form>
	);
}
