"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sweetAlertSuccess } from "@/lib/sweetalert";
import { useTRPC } from "@/trpc/client";
import { setRole, setToken } from "@/utils/session";
import GoogleLoginBtn from "../login/google-login";

const formSchema = z
  .object({
    displayName: z
      .string()
      .min(3, "Display name must be at least 3 characters long.")
      .max(20, "Display name must be at most 20 characters long.")
      .regex(/^[^0-9]+$/, "Display name cannot contain numbers"),

    mobileNumber: z
      .string()
      .regex(/^\d+$/, "Mobile must be digits only")
      .min(10, "Mobile number must be 10 digits")
      .max(10, "Mobile number must be 10 digits")
      .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    email: z.string().optional().or(z.literal("")),
    password: z
      .string()
      .min(8, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password and confirm password do not match",
  });

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be digits only"),
});

export function RegisterForm({ className }: React.ComponentProps<"div">) {
  const trpc = useTRPC();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOTP] = useState<string>("");
  const [tempFormData, setTempFormData] = useState<any>(null);
  const router = useRouter();
  const { mutate, isPending } = useMutation(
    trpc.auth.sendOTP.mutationOptions(),
  );
  const { mutate: verifyOTP } = useMutation(
    trpc.auth.verifyOTP.mutationOptions(),
  );
  const [resendTimer, setResendTimer] = useState(0);
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);
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

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const sendOTP = (phoneNumber: string, email?: string) => {
    console.log("Idntifier", phoneNumber);

    try {
      if (email) {
        mutate(
          { phone: phoneNumber, email: email },
          {
            onSuccess: (data) => {
              if (data?.success) {
                sweetAlertSuccess(data?.message);
                setStep("verify");
              }
              console.log("otp sended successfully");
            },
            onError: (error) => {
              console.log("Error", error.data?.httpStatus);
              if (error?.data?.httpStatus === 401) {
                Swal.fire({
                  icon: "error",
                  title: "Already In Use",
                  text: "Mobile number or email you've try with singup is already in use! try login or use another number or email",
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!",
                });
              }
            },
          },
        );
      } else {
        mutate(
          { phone: phoneNumber },
          {
            onSuccess: () => {
              console.log("otp sended successfully");
              setStep("verify");
            },
            onError: (error) => {
              console.log("Error", error.data?.httpStatus);
              if (error?.data?.httpStatus === 401) {
                Swal.fire({
                  icon: "error",
                  title: "Already In Use",
                  text: "Mobile number you've try with singup is already in use! try login or use another number",
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!",
                });
              }
            },
          },
        );
      }

      // Start resend timer (60 seconds)
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return true;
    } catch (err) {
      return false;
    }
  };

  // Handle registration form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setTempFormData(data);
    console.log("Data", data);
    if (data.email) {
      sendOTP(String(data.mobileNumber), String(data.email));
    } else {
      sendOTP(String(data.mobileNumber));
    }
  };

  // Handle OTP verification
  const onVerifyOTP = async (data: z.infer<typeof otpSchema>) => {
    if (data.otp.length !== 6) {
      Swal.fire({
        icon: "info",
        title: "Invalid OTP",
        text: "OTP Must Be A Six Digits",
      });
      return;
    }
    console.log("====================> execution comes here");
    try {
      console.log("verifying otp");

      // Prepare the payload, making email optional if not provided
      const verificationPayload: any = {
        phoneNumber: tempFormData.mobileNumber,
        displayName: tempFormData.displayName,
        password: tempFormData.password,
        otp: data.otp,
      };

      // Only include email if it exists and is valid
      if (tempFormData.email && tempFormData.email.trim() !== "") {
        verificationPayload.email = tempFormData.email.trim();
      }

      console.log("Verification payload:", verificationPayload);

      verifyOTP(verificationPayload, {
        onSuccess: async (data) => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Account created successfully!",
          });
          setToken(data?.session || "");
          setRole(data?.role || "");
          console.log("registration sucessfully");
          router.push("/");
        },
        onError: async (err) => {
          console.error("OTP verification failed:", err);
          Swal.fire({
            icon: "error",
            title: "Something Wents Wrong",
            text: err?.message || "Please check the code and try again.",
          });
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    sendOTP(tempFormData.mobileNumber);
  };

  // Handle back to registration
  const handleBack = () => {
    setStep("register");
    otpForm.reset();
  };

  if (step === "verify") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/30 to-background px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Verify Your Phone
            </h1>
            <p className="text-sm text-muted-foreground">
              We've sent a 6-digit code to{" "}
              <span className="font-semibold">
                *******
                {tempFormData?.mobileNumber.slice(7, 10)}
              </span>
            </p>
          </div>

          <div className="rounded-2xl bg-card shadow-sm border p-6 sm:p-8">
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(onVerifyOTP)}
                className="space-y-5"
              >
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-sm font-medium">Enter OTP</Label>
                      <FormControl>
                        <input
                          placeholder="000000"
                          maxLength={6}
                          className="rounded-xl text-center text-2xl tracking-widest"
                          onChange={(e) => setOTP(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="w-full rounded-xl py-5 font-semibold"
                  onClick={() => {
                    onVerifyOTP({ otp });
                  }}
                >
                  {isPending ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 space-y-3 text-center text-sm">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendTimer > 0 || isPending}
                className={`text-primary hover:underline disabled:text-muted-foreground disabled:no-underline ${resendTimer > 0 ? "cursor-not-allowed" : ""}`}
              >
                {resendTimer > 0
                  ? `Resend OTP in ${resendTimer}s`
                  : "Resend OTP"}
              </button>

              <div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  ← Back to registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  <>
                    <FormItem>
                      <Label className="text-sm font-medium">
                        Display Name <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="John Doe"
                          className="rounded-xl"
                          onChange={(e) => {
                            const value = e.target.value.replace(/[0-9]/g, "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />

              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-sm font-medium">
                      Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="98765 43210"
                        className="rounded-xl"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
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
                    <Label>Email</Label>
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
                    <Label>
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="rounded-xl"
                        />
                        {showPassword ? (
                          <Eye
                            className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                            onClick={() => {
                              setShowPassword(!showPassword);
                            }}
                          />
                        ) : (
                          <EyeOff
                            className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        )}
                      </div>
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
                    <Label>
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <FormControl>
                      {/* <div className="relative"> */}
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="rounded-xl"
                      />
                      {/* {showPassword ? (
                          <Eye
                            className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                            onClick={() => {
                              setShowPassword(!showPassword);
                            }}
                          />
                        ) : (
                          <EyeOff
                            className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        )}
                      </div> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-xl py-5 font-semibold"
                disabled={isPending}
              >
                {isPending ? "Sending OTP..." : "Continue"}
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
            <GoogleLoginBtn className="rounded-[12px] py-5" />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <a
            href="/"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
