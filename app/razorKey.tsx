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
import { Check, Loader } from "lucide-react";

const formSchema = z.object({
  key: z.string(),
});

export const RazorKeyForm = ({
  label,
  description,
}: {
  label?: string;
  description?: string;
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
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                {description || "This is your Razorpay API key"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="gap-2 w-full"
          size="lg"
          type="submit"
          disabled={isLoading || isSuccess || !form.formState.isDirty}
        >
          {isLoading ? <Loader className="animate-spin w-4 h-4" /> : null}
          Submit
        </Button>

        {isSuccess ? (
          <p className="flex items-center gap-1 text-sm font-medium text-primary/90">
            <Check className="w-4 h-4" />
            Your registration is successful.
          </p>
        ) : null}
      </form>
    </Form>
  );
};
