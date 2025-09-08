"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useId } from "react";

const states = [
  { label: "Rajasthan", value: "Rajasthan" },
  { label: "Panjab", value: "panjab" },
  { label: "Marastara", value: "maharastrara" },
] as const;

export default function Page() {
  const id = useId();

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="flex justify-center items-center flex-1 p-2 sm:p-4 flex-col">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Your Company Master Info</CardTitle>
          <CardDescription>
            Enter your company below to have company account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                <div className="gap-2 flex-1 min-w-60">
                  <Label htmlFor={`${id}-name`}>Name</Label>
                  <Input
                    id={`${id}-name`}
                    type="text"
                    placeholder="Edge Software"
                    required
                  />
                </div>
                <div className="gap-2 flex-1 min-w-60">
                  <Label htmlFor={`${id}-gstno`}>GST No.</Label>
                  <Input
                    id={`${id}-gstno`}
                    type="text"
                    placeholder="22AAAAA0000A125"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 gap-2">
                  <Label htmlFor={`${id}-address-1`}>Address 1</Label>
                  <Input
                    id={`${id}-address-1`}
                    type="text"
                    placeholder="build no , street "
                    required
                  />
                </div>
                <div className="flex-1 gap-2">
                  <Label htmlFor={`${id}-address-2`}>Address 2</Label>
                  <Input
                    id={`${id}-address-2`}
                    type="text"
                    placeholder="Area "
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${id}-address-3`}>Address 3</Label>
                <Input
                  id={`${id}-address-3`}
                  type="text"
                  placeholder="District"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${id}-state`}>State</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {value
                        ? states.find((framework) => framework.value === value)
                            ?.label
                        : "Select framework..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search State..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No State found.</CommandEmpty>
                        <CommandGroup>
                          {states.map((state) => (
                            <CommandItem
                              key={state.value}
                              value={state.value}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue,
                                );
                                setOpen(false);
                              }}
                            >
                              {state.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value === state.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-row flex gap-2">
          <Button type="submit" className="flex-1">
            Save
          </Button>
          <Button variant="outline" className="flex-1">
            Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
