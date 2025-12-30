"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaritalStatus } from "@repo/db/dist/enum/allEnum.enum";
import { profileUpdateSchema } from "@repo/db/dist/schema/user.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";

type UserProfile = OutputTrpcType["userRouter"]["edit"] | null;

type UserUpdateSchema = z.infer<typeof profileUpdateSchema>;
export default function UserProfile({ user }: { user: UserProfile }) {
  const trpc = useTRPC();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<UserUpdateSchema>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      profileImage: user?.profile?.profileImage ?? "",
      salutation: user?.profile?.salutation ?? NaN,
      firstName: user?.profile?.firstName ?? "",
      lastName: user?.profile?.lastName ?? "",
      dob: user?.profile?.dob ?? "",
      occupation: user?.profile?.occupation ?? null,
      maritalStatus: user?.profile?.maritalStatus ?? "Married",
      address: user?.profile?.address ?? "",
      pincode: user?.profile?.pincode ?? "",
      city: user?.profile?.city ?? 0,
      state: user?.profile?.state ?? 0,
    },
  });
  const { mutate } = useMutation(trpc.userRouter.update.mutationOptions());
  const onSubmit = async (data: UserUpdateSchema) => {
    const file = await uploadToCloudinary([data.profileImage], "profile");
    const finalData = {
      ...data,
      profileImage: file[0] ?? "",
    };
    mutate(finalData, {
      onSuccess: (data) => {
        console.log("success", data);
        Swal.fire({
          title: data.message,
          icon: "success",
          draggable: true,
        });
        router.push("/");
      },
      onError: (error) => {
        if (isTRPCClientError(error)) {
          Swal.fire({
            title: error.message,
            icon: "error",
            draggable: true,
          });
          console.error("error,", error.message);
        }
      },
    });
  };

  const states = user?.getStates?.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const selectedStateId = useWatch({ control, name: "state" });

  const { data: cities, isLoading } = useQuery(
    trpc.hirerouter.getCities.queryOptions({
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
      options: user?.getOccupations?.map((item) => {
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
  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl ">
        <div className="w-[90%] mx-auto bg-white shadow rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="w-32 h-32 border shadow-sm">
            <AvatarImage src="/images/demo-img.webp" alt="User Profile" />
            <div className="-mt-4 -ml-2">
              <FormField
                control={control}
                label=""
                name="profileImage"
                required={false}
                component="image"
              />
            </div>
            <AvatarFallback className="text-2xl font-bold">UP</AvatarFallback>
          </Avatar>

          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-bold">
              {user?.profile?.firstName
                ? `${user?.profile?.firstName} ${user?.profile?.lastName ?? ""}`
                : "User Name"}
            </h2>
            <p className="text-muted-foreground">
              {user?.role ? user.role : ""}
            </p>
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
                options={user?.getSlutation.map((item) => {
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
