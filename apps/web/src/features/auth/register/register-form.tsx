"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "../authStore";

const formSchema = z
  .object({
    displayName: z
      .string()
      .min(3, "Display name must be at least 3 characters long.")
      .max(20, "Display name must be at most 20 characters long."),
    mobileNumber: z
      .string()
      .regex(/^\d+$/, "Mobile must be digits only")
      .min(10, "Mobile number must be 10 digits")
      .max(10, "Mobile number must be 10 digits"),
    email: z.string().optional().or(z.literal("")),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password and confirm password do not match",
  });

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const authData = useAuthStore((state) => state.authData);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      mobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setAuthData(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/30 to-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join <span className="font-semibold">Just Search</span> and start
            exploring today
          </p>
        </div>

        <div className="rounded-2xl bg-card shadow-sm border p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Display Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Mobile Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="98765 43210"
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="example@email.com"
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirm Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-xl py-5 font-semibold"
              >
                Create Account
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid gap-3">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 rounded-xl py-5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
                className="h-5 w-5"
              >
                <title>Google</title>{" "}
                <path
                  fill="currentColor"
                  d="M488 261.8c0-17.8-1.6-35.2-4.7-52H249v98.6h134.1c-5.8 31.4-23.2 57.9-49.5 75.8v62.7h79.8c46.7-43 74-106.4 74-185.1zM249 492c67 0 123.1-22.1 164.1-60.1l-79.8-62.7c-22.1 14.9-50.4 23.6-84.3 23.6-64.9 0-119.9-43.8-139.6-102.7H27.2v64.5C68.7 429.3 152.1 492 249 492zM109.4 289.1c-4.7-14.1-7.3-29.1-7.3-44.6s2.6-30.5 7.3-44.6v-64.5H27.2C9.8 169.5 0 207.2 0 244.5s9.8 75 27.2 108.9l82.2-64.3zM249 97.9c36.4 0 69.1 12.6 94.9 37.4l71.1-71.1C372.1 24.8 316 2 249 2 152.1 2 68.7 64.7 27.2 161.5l82.2 64.5C129.1 141.7 184.1 97.9 249 97.9z"
                />
              </svg>
              Google
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
