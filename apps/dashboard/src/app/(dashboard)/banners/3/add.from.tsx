import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useForm, type FieldValues } from "react-hook-form";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";

export function AddBanner() {
  const { control } = useForm<FieldValues>();

  const formFields: FormFieldProps<FieldValues>[] = [
    {
      control,
      label: "Type",
      name: "type",
      placeholder: "Select Type of banner",
      component: "select",
      options: [
        { label: "Banner 1", value: "1" },
        { label: "Banner 2", value: "2" },
        { label: "Banner 3", value: "3" },
        { label: "Banner 4", value: "4" },
      ],
    },
    {
      control,
      label: "Redirect Route",
      name: "route",
      placeholder: "/business/vastrakala",
      component: "input",
      required: false,
    },
    {
      control,
      type: "file",
      label: "Resume/CV",
      name: "resumePdf",
      placeholder: "",
      component: "input",
      required: false,
      error: "",
    },
    {
      control,
      label: "Active",
      name: "is_active",
      placeholder: "",
      component: "select",
      options: [
        { label: "True", value: "1" },
        { label: "False", value: "2" },
      ],
    },
  ];
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Add Banner</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Banner</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-6">
            {formFields.map((field) => (
              <FormField key={field.name} {...field} />
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
