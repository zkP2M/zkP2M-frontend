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
import { Loader } from "lucide-react";

const formSchema = z.object({
  key: z.string(),
});

export const RazerKey = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
    },
  });

  const razorKey = form.watch("key");
  const { isLoading, isError, error, isSuccess, writeAsync, data } =
    useP2MContractWrite("register");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    const res = await writeAsync([
      [0, 0],
      [
        [0, 0],
        [0, 0],
      ],
      [0, 0],
      [razorKey],
    ]);

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
              <FormLabel>Razorpay API Key</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>This is your Razorpay API key.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="gap-2"
          type="submit"
          disabled={isLoading || isSuccess || !form.formState.isDirty}
        >
          {isLoading ? <Loader className="animate-spin w-4 h-4" /> : null}
          Submit
        </Button>
      </form>
    </Form>
  );
};
