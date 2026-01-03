"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaritalStatus } from "@repo/db/dist/enum/allEnum.enum";
import {
  profileInsertSchema,
  profileUpdateSchema,
} from "@repo/db/dist/schema/user.schema";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { SetOpen } from "../../../edit.form";
import { useUserFormStore } from "../../../shared/store/useCreateHireStore";
import type { EditAdminUserType } from "..";

export const adminEditProfileInsertSchema = profileUpdateSchema.omit({
  userId: true,
});
type ProfileSchema = z.infer<typeof adminEditProfileInsertSchema>;
export default function ProfileForm({
  id,
  data,
  setOpen,
}: {
  id: number;
  data: EditAdminUserType;
  setOpen: SetOpen;
}) {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.adminUsersRouter.update.mutationOptions(),
  );
  const formValue = useUserFormStore((state) => state.formValue);
  const prevPage = useUserFormStore((state) => state.prevPage);
  const clearPage = useUserFormStore((state) => state.clearPage);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(adminEditProfileInsertSchema),
    defaultValues: {
      address: data?.profileData?.address ?? "",
      profileImage: data?.profileData?.profileImage ?? "",
      firstName: data?.profileData?.firstName ?? "",
      dob: data?.profileData?.dob ?? null,
      lastName: data?.profileData?.lastName ?? "",
      salutation: data?.profileData?.salutation ?? NaN,
      occupation: data?.profileData?.occupation ?? null,
      maritalStatus: data?.profileData?.maritalStatus ?? "Married",
      pincode: data?.profileData?.pincode ?? "",
      city: data?.profileData?.city ?? NaN,
      state: data?.profileData?.state ?? NaN,
    },
  });

  const selectedState = useWatch({ control, name: "state" });

  // const { data: } = useSuspenseQuery(trpc.adminUsersRouter.add.queryOptions());
  const { data: cities, isLoading } = useQuery(
    trpc.adminUtilsRouter.getCities.queryOptions({
      state: Number(selectedState),
    }),
  );
  const onSubmit = async (data: ProfileSchema) => {
    const file = await uploadToCloudinary([data.profileImage], "profile");
    const finalData = {
      ...formValue,
      ...data,
      profileImage: file[0] ?? "",
    };
    mutate(
      { ...finalData, id },
      {
        onSuccess: async (data) => {
          if (data?.success) {
            clearPage();
            toast("success", {
              description: data.message,
            });
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({
              queryKey: trpc.adminUsersRouter.list.queryKey(),
            });
            queryClient.invalidateQueries({
              queryKey: trpc.adminUsersRouter.edit.queryKey(),
            });
            setOpen(false);
          }
          console.log("success", data);
        },
        onError: async (error) => {
          if (isTRPCClientError(error)) {
            toast.error("Error", {
              description: error.message,
            });
            console.error("error,", error);
          }
        },
      },
    );
  };

  const formFields: FormFieldProps<ProfileSchema>[] = [
    {
      control,
      name: "profileImage",
      label: "Photo",
      component: "image",
      required: false,
      className: "mx-auto w-[90%]",
    },
    {
      control,
      name: "salutation",
      label: "Title",
      component: "select",
      options: data.getSalutation.map((item) => ({
        label: item.name,
        value: item.id,
      })),
      placeholder: "Select Title",
      error: errors.salutation?.message,
    },
    {
      control,
      name: "firstName",
      label: "First Name",
      placeholder: "Enter your First Name",
      component: "input",
      required: false,
      className: "w-[90%] bg-base-200",
      error: errors.firstName?.message,
    },
    {
      control,
      name: "lastName",
      label: "Last Name",
      placeholder: "Enter your Last Name",
      component: "input",
      required: false,
      className: "w-[90%] bg-base-200",
      error: errors.lastName?.message,
    },
    {
      control,
      // type: "date",
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
      options: data.getOccupation.map((item) => ({
        label: item.name,
        value: item.id,
      })),
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
      placeholder: "Address",
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
        data.getStates.map((state) => ({
          label: state.name,
          value: state.id,
        })) ?? [],
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
    <div className="min-h-screen p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto bg-gray-100 rounded-lg shadow-xl"
      >
        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map((field) => (
                <FormField key={field.name} {...field} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            onClick={prevPage}
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            PREVIOUS
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            {isSubmitting ? (
              <>
                {" "}
                <Spinner /> Submitting...{" "}
              </>
            ) : (
              "SUBMIT"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
