"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaritalStatus } from "@repo/db/dist/enum/allEnum.enum";
import { profileInsertSchema } from "@repo/db/dist/schema/user.schema";
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
import type { SetOpen } from "../../../add.form";
import { useUserFormStore } from "../../../shared/store/useCreateHireStore";

export const adminAddProfileInsertSchema = profileInsertSchema.omit({
  userId: true,
});
type ProfileSchema = z.infer<typeof adminAddProfileInsertSchema>;
export default function ProfileForm({ setOpen }: { setOpen: SetOpen }) {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.adminUsersRouter.create.mutationOptions(),
  );
  const formValue = useUserFormStore((state) => state.formValue);
  const prevPage = useUserFormStore((state) => state.prevPage);
  const clearPage = useUserFormStore((state) => state.clearPage);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(adminAddProfileInsertSchema),
    defaultValues: {
      address: "",
      profileImage: "",
      firstName: "",
      dob: null,
      lastName: "",
      salutation: "",
      occupation: null,
      maritalStatus: "Married",
      area: "",
      pincode: "",
      city: NaN,
      state: NaN,
    },
  });

  const selectedState = useWatch({ control, name: "state" });

  const { data } = useSuspenseQuery(trpc.adminUsersRouter.add.queryOptions());
  const { data: cities, isLoading } = useQuery(
    trpc.adminUtilsRouter.getCities.queryOptions({
      state: selectedState,
    }),
  );
  const onSubmit = async (data: ProfileSchema) => {
    const file = await uploadToCloudinary([data.profileImage], "profile");
    const finalData = {
      ...formValue,
      ...data,
      profileImage: file[0] ?? "",
    };
    mutate(finalData, {
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
          setOpen(false);
        }
        console.log("success", data);
      },
      onError: async (error) => {
        if (isTRPCClientError(error)) {
          toast.error("Error", {
            description: error.message,
          });
          console.error("error,", error.message);
        }
      },
    });
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
      options: [
        { label: "Mr", value: "Mr" },
        { label: "Ms", value: "Ms" },
        { label: "Mrs", value: "Mrs" },
      ],
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
      error: "",
    },
    {
      control,
      label: "Occupation",
      name: "occupation",
      placeholder: "Occupation",
      required: false,
      component: "select",
      options: data.occupation.map((item) => ({
        label: item.name,
        value: item.id,
      })),
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
        data.states.map((state) => ({ label: state.name, value: state.id })) ??
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
