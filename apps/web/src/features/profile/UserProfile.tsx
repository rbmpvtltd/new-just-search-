"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaritalStatus } from "@repo/db/dist/enum/allEnum.enum";
import { profileUpdateSchema } from "@repo/db/dist/schema/user.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { sweetAlertError, sweetAlertSuccess } from "@/lib/sweetalert";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { OutputTrpcType } from "@/trpc/type";
import profileImage from "../../../public/images/logo.png";

type UserProfile = OutputTrpcType["userRouter"]["edit"] | null | undefined;

type UserUpdateSchema = z.infer<typeof profileUpdateSchema>;
function UserProfile({ data }: { data: UserProfile }) {
  const trpc = useTRPC();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<UserUpdateSchema>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      profileImage: data?.profile?.profileImage ?? "",
      salutation: data?.profile?.salutation ?? 0,
      firstName: data?.profile?.firstName ?? "",
      lastName: data?.profile?.lastName ?? "",
      dob: data?.profile?.dob ?? "",
      occupation: data?.profile?.occupation ?? null,
      maritalStatus: data?.profile?.maritalStatus ?? "Married",
      address: data?.profile?.address ?? "",
      pincode: data?.profile?.pincode ?? "",
      city: data?.profile?.city ?? 0,
      state: data?.profile?.state ?? 0,
    },
  });

  const { mutate } = useMutation(trpc.userRouter.update.mutationOptions());

  console.log("data", data);

  const onSubmit = async (data: UserUpdateSchema) => {
    const file = await uploadToCloudinary([data.profileImage], "profile");
    const finalData = {
      ...data,
      profileImage: file[0] ?? "",
    };

    console.log("finalData", file);
    mutate(finalData, {
      onSuccess: (data) => {
        if (data.success) {
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({
            queryKey: trpc.userRouter.edit.queryKey(),
          });
          sweetAlertSuccess(data.message);
          // router.push("/");
        }
      },
      onError: (error) => {
        if (isTRPCClientError(error)) {
          sweetAlertError(error.message);
          console.error("error,", error.message);
        }
      },
    });
  };

  const states = data?.getStates?.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const selectedStateId = useWatch({ control, name: "state" });

  const { data: cities, isLoading } = useQuery(
    trpc.userRouter.getCities.queryOptions({
      state: Number(selectedStateId),
    }),
  );

  const formFields: FormFieldProps<UserUpdateSchema>[] = [
    {
      control,
      label: "Date of Birth",
      name: "dob",
      placeholder: "Date of Birth",
      required: false,
      component: "calendar",
      error: errors.dob?.message,
    },
    {
      control,
      label: "Occupation",
      name: "occupation",
      placeholder: "Occupation",
      required: false,
      component: "select",
      options: data?.getOccupations?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      }),
      error: errors.occupation?.message,
    },
    {
      control,
      label: "Marital Status",
      name: "maritalStatus",
      placeholder: "Marital Status",
      required: false,
      component: "select",
      options: Object.values(MaritalStatus).map((item) => {
        return {
          label: item,
          value: item,
        };
      }),
      error: errors.maritalStatus?.message,
    },
    {
      control,
      label: "Address",
      name: "address",
      placeholder: "Enter Address",
      required: false,
      component: "input",
      error: errors.address?.message,
    },
    {
      control,
      label: "Pincode",
      name: "pincode",
      placeholder: "Pincode",
      required: false,
      component: "input",
      error: errors.pincode?.message,
    },
    {
      control,
      label: "State",
      name: "state",
      placeholder: "State",
      required: false,
      component: "select",
      options:
        states?.map((state) => ({ label: state.label, value: state.value })) ??
        [],
      error: errors.state?.message,
    },
    {
      control,
      label: "City",
      name: "city",
      placeholder: "City",
      required: false,
      component: "select",
      loading: isLoading,
      options:
        cities?.map((city) => ({ label: city.city, value: city.id })) ?? [],
      error: errors.city?.message,
    },
  ];

  console.log("Plan", data);

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl ">
        <div className="w-[90%] mx-auto bg-white shadow rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="w-36 h-36 border-4 border-white shadow-md overflow-hidden">
              <div className="flex items-center justify-center w-full h-full bg-gray-50">
                <FormField
                  control={control}
                  name="profileImage"
                  required={false}
                  component="image"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
                UP
              </AvatarFallback>
            </Avatar>

            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="-translate-y-4 text-white text-sm font-medium">
                <Camera />
              </span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              {data?.profile?.firstName
                ? `${data?.profile?.firstName} ${data?.profile?.lastName ?? ""}`
                : "User Name"}
            </h2>

            <p className="text-sm text-muted-foreground">
              {data?.role.toUpperCase() ?? "Guest"}
            </p>
            <p className="text-sm text-muted-foreground">
              {data?.userEmail ?? "user@email.com"}
            </p>

            <div className="h-px w-20 bg-gray-200 mx-auto md:mx-0 my-2" />

            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 ${data?.plan?.name === "FREE" || data?.plan?.name === undefined ? "text-red-700" : "text-green-700"} text-sm font-medium`}
            >
              <span
                className={`w-2 h-2 rounded-full ${data?.plan?.name === "FREE" || data?.plan?.name === undefined ? "bg-red-500" : "bg-green-500"} `}
              />
              {data?.plan?.name ?? "Free Plan"}
            </div>
          </div>
        </div>

        <div>
          <Image
            src={profileImage}
            width={500}
            height={500}
            className=""
            alt="profile image"
          />
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
                options={data?.getSlutation.map((item) => {
                  return {
                    label: item.name,
                    value: item.id,
                  };
                })}
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
            {isSubmitting ? (
              <>
                {" "}
                <Spinner /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function GetUserProfile() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.userRouter.edit.queryOptions());

  if (isLoading) {
    return <Spinner />;
  }

  return <UserProfile data={data} />;
}
