"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { setRole, setToken } from "@/utils/session";

const forgotPasswordSchema = z.object({
  identifier: z.string().min(1),
});

const otpVerifySchema = z.object({
  otp: z.string().length(6).regex(/^\d+$/),
  newPassword: z.string().min(6),
});

export default function ForgotPasswordForm() {
  const id = useId();
  const trpc = useTRPC();

  const [step, setStep] = useState<"send" | "verify">("send");
  const [masked, setMasked] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const sendForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: "" },
  });

  const verifyForm = useForm({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: { otp: "", newPassword: "" },
  });

  const sendOtpMutation = useMutation(
    trpc.auth.forgetPassword.mutationOptions(),
  );

  const verifyOtpMutation = useMutation(
    trpc.auth.resetPassword.mutationOptions(),
  );

  function onSubmitSend(values: z.infer<typeof forgotPasswordSchema>) {
    setIdentifier(values.identifier);
    sendOtpMutation.mutate(values, {
      onSuccess: () => {
        const id = values.identifier;
        const mask = id.includes("@")
          ? id.replace(/(.{2}).+(@.*)/, "$1*****$2")
          : id.replace(/.(?=.{4})/g, "*");
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: `OTP sent successfully on ${mask}`,
        });
        setMasked(mask);
        setStep("verify");
      },
    });
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
  }

  function onSubmitVerify(values: z.infer<typeof otpVerifySchema>) {
    verifyOtpMutation.mutate(
      { identifier, newPassword: values.newPassword, otp: values.otp },
      {
        onSuccess: (data) => {
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: "Password Update Successfully",
          });
          router.push("/login");
        },
        onError: async (err) => {
          Swal.fire({
            icon: "info",
            title: "Invalid OTP",
            text: err?.message || "Invalid Otp Try Again.",
          });
        },
      },
    );
  }
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    sendOtpMutation.mutate(
      { identifier },
      {
        onSuccess: () => {
          const mask = identifier.includes("@")
            ? id.replace(/(.{2}).+(@.*)/, "$1*****$2")
            : id.replace(/.(?=.{4})/g, "*");
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: `OTP sent successfully on ${mask}`,
          });
        },
      },
    );
  };
  const handleBack = () => {
    setStep("send");
    verifyForm.reset();
  };

  if (step === "verify") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="shadow-xl border border-gray-300 pt-6 ">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Verify OTP</h1>
              <p className="text-sm text-muted-foreground">
                Code was sent to {masked}
              </p>
            </div>
            <CardContent className="p-6">
              <Form {...verifyForm}>
                <form
                  onSubmit={verifyForm.handleSubmit(onSubmitVerify)}
                  className="space-y-5"
                >
                  <FormField
                    control={verifyForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter OTP</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            maxLength={6}
                            placeholder="000000"
                            className="text-center text-xl tracking-widest"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={verifyForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="New password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Change Password
                  </Button>
                </form>
              </Form>
              <div className="mt-6 space-y-3 text-center text-sm">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || sendOtpMutation.isPending}
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <div className="w-full max-w-lg shadow-xl border border-gray-300 rounded-md space-y-6 mx-auto">
        <Card>
          <CardContent className="p-6 md:p-8">
            <Form {...sendForm}>
              <form onSubmit={sendForm.handleSubmit(onSubmitSend)}>
                <div className="flex flex-col gap-6">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold">Forgot Password?</h1>
                    <p className="text-muted-foreground text-sm mt-2">
                      Enter your email or phone number to receive an OTP.
                    </p>
                  </div>

                  <FormField
                    control={sendForm.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email or Mobile Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id={`identifier-${id}`}
                            placeholder="email@example.com or 9876543210"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Send OTP
                  </Button>

                  <div className="text-center text-sm">
                    <Link
                      href="/login"
                      className="underline-offset-4 hover:underline"
                    >
                      Back to login
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
