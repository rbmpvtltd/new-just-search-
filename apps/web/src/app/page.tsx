"use client";

import { useForm } from "react-hook-form";
import { FormField } from "@/components/form-component";

type LoginForm = {
  email: string;
  password: string;
};
export default function Home() {
  const { control, handleSubmit } = useForm<LoginForm>();
  return (
    <form onSubmit={handleSubmit(console.log)}>
      <FormField<LoginForm>
        control={control}
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        component="input"
      />
      <FormField<LoginForm>
        control={control}
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        component="input"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
