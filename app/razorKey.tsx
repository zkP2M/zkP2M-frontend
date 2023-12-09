"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useP2MContractWrite } from "@/contract";
import { Check, Loader, SquareUser } from "lucide-react";

const formSchema = z.object({
  key: z.string(),
});

export const RazorKeyForm = ({
  label,
  description,
  placeholder,
}: {
  label?: string;
  description?: string;
  placeholder?: string;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
    },
  });

  const { isLoading, isSuccess, writeAsync } = useP2MContractWrite(
    "registerWithoutProof"
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    const key = values.key;
    const formattedKey = key.replace("rzp_test_", "").replace("rzp_live_", "");

    const res = await writeAsync([formattedKey]);

    console.log("register", res);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label || "Razorpay API Key"}</FormLabel>
              <FormControl>
                <Input placeholder={placeholder} {...field} />
              </FormControl>
              <FormDescription>
                {description || "This is your Razorpay API key"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-6 items-center">
          <Button
            className="gap-2 w-fit"
            size="lg"
            type="submit"
            disabled={isLoading || isSuccess || !form.formState.isDirty}
          >
            {isLoading ? (
              <Loader className="animate-spin w-6 h-6" />
            ) : (
              <SquareUser className="w-6 h-6" />
            )}
            Register
          </Button>

          {isSuccess ? (
            <p className="flex items-center gap-1 text-xl font-bold text-primary/90">
              <Check className="w-6 h-6" />
              Your registration is successful.
            </p>
          ) : null}
        </div>
      </form>
    </Form>
  );
};
