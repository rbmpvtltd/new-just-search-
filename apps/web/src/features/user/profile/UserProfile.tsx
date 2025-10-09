"use client";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { type FieldValues, useForm } from "react-hook-form";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

export default function UserProfile() {
  const { control, handleSubmit } = useForm<FieldValues>();
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.userRouter.updateProfile.mutationOptions(),
  );

  const onSubmit = (data: FieldValues) => {
    console.log(data);
    mutate(data, {
      onSuccess: () => {
        console.log("success", data);
      },
    });
  };

  const formFields: FormFieldProps<FieldValues>[] = [
    {
      control,
      label: "Email",
      name: "email",
      placeholder: "Email",
      required: false,
      component: "input",
      error: "",
    },
    {
      control,
      label: "Date of Birth",
      name: "dateOfBirth",
      placeholder: "Date of Birth",
      required: false,
      component: "calendar",
      error: "",
    },
    {
      control,
      label: "Occupation",
      name: "occupation",
      placeholder: "Occupation",
      required: false,
      component: "select",
      options: [
        { label: "Employed", value: "Employed" },
        { label: "Unemployed", value: "Unemployed" },
        { label: "Farmer", value: "Farmer" },
        { label: "Media", value: "Media" },
        { label: "Business Man", value: "Business Man" },
        { label: "Sports", value: "Sports" },
        { label: "Armed forces", value: "Armed forces" },
        { label: "Government Service", value: "Government Service" },
        { label: "CA", value: "CA" },
        { label: "Doctor", value: "Doctor" },
        { label: "Lawyer", value: "Lawyer" },
        { label: "Retired", value: "Retired" },
        { label: "Student", value: "Student" },
        { label: "Clerk", value: "Clerk" },
        { label: "Others", value: "Others" },
      ],
    },
    {
      control,
      label: "Marital Status",
      name: "maritalStatus",
      placeholder: "Marital Status",
      required: false,
      component: "select",
      options: [
        { label: "Married", value: "married" },
        { label: "Unmarried", value: "unmarried" },
        { label: "Widowed", value: "widowed" },
        { label: "Divorced", value: "divorced" },
      ],
    },
    {
      control,
      label: "Area",
      name: "area",
      placeholder: "Area",
      required: false,
      component: "input",
      error: "",
    },
    {
      control,
      label: "Pincode",
      name: "pincode",
      placeholder: "Pincode",
      required: false,
      component: "input",
      error: "",
    },
    {
      control,
      label: "City",
      name: "city",
      placeholder: "City",
      required: false,
      component: "select",
      options: [
        { label: "Pune", value: "Pune" },
        { label: "Mumbai", value: "Mumbai" },
        { label: "Kolkata", value: "Kolkata" },
        { label: "Delhi", value: "Delhi" },
        { label: "Chennai", value: "Chennai" },
        { label: "Bangalore", value: "Bangalore" },
        { label: "Hyderabad", value: "Hyderabad" },
      ],
      error: "",
    },
    {
      control,
      label: "State",
      name: "state",
      placeholder: "State",
      required: false,
      component: "select",
      options: [
        { label: "Pune", value: "Pune" },
        { label: "Mumbai", value: "Mumbai" },
        { label: "Kolkata", value: "Kolkata" },
        { label: "Delhi", value: "Delhi" },
        { label: "Chennai", value: "Chennai" },
        { label: "Bangalore", value: "Bangalore" },
        { label: "Hyderabad", value: "Hyderabad" },
      ],
      error: "",
    },
  ];
  return (
    <div className="p-8 bg-muted/20 min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-xl mx-auto rounded-xl max-w-4xl bg-white"
      >
        <div className="w-[90%] mx-auto bg-white shadow rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="w-24 h-24 border shadow-sm">
            <AvatarImage src="/placeholder-user.jpg" alt="User Profile" />
            <AvatarFallback className="text-2xl font-bold">UP</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-bold">User Name</h2>
            <p className="text-muted-foreground">Admin</p>
            <p className="text-muted-foreground">Activated Plan: Free</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-white space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={control}
                label="Salutation"
                name="salutation"
                required={false}
                component="select"
                options={[
                  { label: "Mr", value: "Mr" },
                  { label: "Mrs", value: "Mrs" },
                  { label: "Ms", value: "Ms" },
                ]}
              />
              <FormField
                control={control}
                label="First Name"
                name="firstName"
                required={false}
                component="input"
              />
              <FormField
                control={control}
                label="Last Name"
                name="lastName"
                required={false}
                component="input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map((field) => (
                <FormField key={field.name} {...field} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            UPDATE
          </Button>
        </div>
      </form>
    </div>
  );
}
