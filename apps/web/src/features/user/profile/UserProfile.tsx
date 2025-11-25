"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MaritalStatus,
  userUpdateSchema,
} from "@repo/db/dist/schema/user.schema";
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

type UserProfile = OutputTrpcType["userRouter"]["getUserProfile"] | null;
type FormReferenceDataType = OutputTrpcType["userRouter"]["add"] | null;

type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
export default function UserProfile({
  user,
  formReferenceData,
}: {
  user: UserProfile;
  formReferenceData: FormReferenceDataType;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UserUpdateSchema>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      profileImage: user?.profileImage ?? "",
      firstName: user?.firstName ?? "",
      dob: user?.dob ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      salutation: user?.salutation ?? "",
      occupation: user?.occupation ?? "",
      maritalStatus: user?.maritalStatus ?? "Married",
      area: user?.area ?? "",
      pincode: user?.pincode ?? "",
      city: user?.city ?? 0,
      state: user?.state ?? 0,
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

  const states = formReferenceData?.getStates.map((item: any) => {
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
      label: "Email",
      name: "email",
      placeholder: "Email",
      required: false,
      component: "input",
      error: "",
    },
    {
      control,
      // type: "date",
      label: "Date of Birth",
      name: "dob",
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
      options: Object.values(MaritalStatus).map((item) => {
        return {
          label: item,
          value: item,
        };
      }),
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
      label: "State",
      name: "state",
      placeholder: "State",
      required: false,
      component: "select",
      options:
        states?.map((state) => ({ label: state.label, value: state.value })) ??
        [],
      error: "",
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
          <Avatar className="w-32 h-32 border shadow-sm">
            <AvatarImage src="/placeholder-user.jpg" alt="User Profile" />
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
              {user?.firstName
                ? `${user?.firstName} ${user?.lastName ?? ""}`
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
            {isSubmitting ? (
              <>
                {" "}
                <Spinner /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
          {/* <Button
            type="button"
            onClick={() =>
              console.log(
                normalizeDate(
                  "Date Fri Oct 17 2025 00:00:00 GMT+0530 (India Standard Time)",
                ),
              )
            }
          >
            DEBUG VALUES
          </Button> */}
        </div>
      </form>
    </div>
  );
}
