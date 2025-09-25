"use client";

import type { ControllerRenderProps, Path } from "react-hook-form";
import type { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import ComboSelect from "./combo-select";
import DatePicker from "./date-picker";

import FieldWrapper from "./field-wrapper";
import { type FieldDataType, FieldType } from "./types";

type FieldSchema<T extends FieldDataType> =
	T["schema"] extends z.ZodType<unknown> ? z.infer<T["schema"]> : never;

interface FieldSelectorProps<T extends FieldDataType> {
	fieldData: T;
	field: ControllerRenderProps<FieldSchema<T>, Path<FieldSchema<T>>>;
}

function FieldSelector<T extends FieldDataType>({
	fieldData,
	field,
}: FieldSelectorProps<T>) {
	switch (fieldData.type) {
		case FieldType.Select:
			return (
				<FieldWrapper
					className={fieldData.className}
					label={fieldData.label}
					description={fieldData.description}
					htmlFor={fieldData.name}
				>
					<Select
						onValueChange={field.onChange}
						value={(field.value as string) ?? ""}
						required={fieldData.required}
						data-testid={fieldData.testId}
					>
						<SelectTrigger id={fieldData.name}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{fieldData.options.map((option) => {
								const label =
									typeof option === "string" ? option : option.label;
								const value =
									typeof option === "string" ? option : option.value;
								return (
									<SelectItem key={value + label} value={value + ""}>
										{label}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</FieldWrapper>
			);
		case FieldType.Text:
			return (
				<FieldWrapper
					className={fieldData.className}
					label={fieldData.label}
					description={fieldData.description}
					htmlFor={fieldData.name}
				>
					<Input
						id={fieldData.name}
						{...field}
						data-testid={fieldData.testId}
					/>
				</FieldWrapper>
			);
		case FieldType.Number:
			return (
				<FieldWrapper
					className={fieldData.className}
					label={fieldData.label}
					description={fieldData.description}
					htmlFor={fieldData.name}
				>
					<Input
						{...field}
						type="number"
						id={fieldData.name}
						data-testid={fieldData.testId}
					/>
				</FieldWrapper>
			);
		case FieldType.Textarea:
			return (
				<FieldWrapper
					className={fieldData.className}
					label={fieldData.label}
					description={fieldData.description}
					htmlFor={fieldData.name}
				>
					<Textarea
						{...field}
						rows={fieldData.rows ?? 4}
						className="resize-none"
						maxLength={512}
						id={fieldData.name}
						data-testid={fieldData.testId}
					/>
				</FieldWrapper>
			);
		case FieldType.Checkbox:
			return (
				<FormItem
					className={cn(
						"flex h-full flex-col justify-center gap-2 py-6",
						fieldData.className,
					)}
					aria-label={fieldData.label + " field"}
				>
					<div className="flex items-center justify-between">
						<label
							htmlFor={fieldData.name}
							className="text-lg text-muted-foreground"
						>
							{fieldData.label}
						</label>
						<Checkbox
							id={fieldData.name}
							checked={field.value as boolean}
							onCheckedChange={field.onChange}
							className="size-5 border-2"
							data-testid={fieldData.testId}
						/>
					</div>
					<FormMessage />
					{fieldData.description && (
						<FormDescription className="text-xs">
							{fieldData.description}
						</FormDescription>
					)}
				</FormItem>
			);
		case FieldType.DatePicker:
			return (
				<FormItem
					className={cn(
						"flex h-full flex-col justify-center gap-2",
						fieldData.className,
					)}
					aria-label={fieldData.label + " field"}
				>
					<div className="flex items-center justify-between">
						<label
							htmlFor={fieldData.name}
							className="text-lg text-muted-foreground"
						>
							{fieldData.label}
						</label>
						<DatePicker
							required={fieldData.required}
							id={fieldData.name}
							date={field.value as Date}
							onChange={field.onChange}
							allowFuture={fieldData.allowFuture}
							data-testid={fieldData.testId}
						/>
					</div>
					<FormMessage />
					{fieldData.description && (
						<FormDescription className="text-xs">
							{fieldData.description}
						</FormDescription>
					)}
				</FormItem>
			);
		case FieldType.ComboSelect:
			return (
				<FieldWrapper
					className={fieldData.className}
					label={fieldData.label}
					description={fieldData.description}
					htmlFor={fieldData.name}
				>
					<ComboSelect
						required={fieldData.required}
						id={fieldData.name}
						data-testid={fieldData.testId}
						value={field.value as string}
						onChange={field.onChange}
						options={fieldData.options}
						selectMessage={fieldData.selectMessage}
						searchMessage={fieldData.searchMessage}
						notFoundMessage={fieldData.notFoundMessage}
					/>
				</FieldWrapper>
			);
		default:
			return null;
	}
}

export default FieldSelector;
