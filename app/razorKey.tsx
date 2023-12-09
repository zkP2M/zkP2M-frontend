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
  const { isLoading, isError, write, writeAsync } =
    useP2MContractWrite("register");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    // update state
    // state.razerKey = values.key;

    const args = [0, 0, 0, values.key];

    // await writeAsync(args);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razer API Key</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>This is your razer key.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
          {isLoading ? <Loader className="animate-spin" /> : null}
          Submit
        </Button>
      </form>
    </Form>
  );
};
