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
  upiId: z.string(),
  amount: z.string(),
  receiveAmount: z.string(),
});

export const DepositForm = () => {
  const { isLoading, isError, write, writeAsync } =
    useP2MContractWrite("offramp");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      upiId: "",
      amount: undefined,
      receiveAmount: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    const args = [values.upiId, values.amount, values.receiveAmount];

    // await writeAsync(args);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="upiId"
          rules={{
            required: "UPI Id is required",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>UPI Id</FormLabel>
              <FormControl>
                <Input placeholder="denosaurabh@paytm" {...field} />
              </FormControl>
              <FormDescription>This is your UPI Id.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          rules={{
            required: "Amount is required",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormDescription>This is your amount.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receiveAmount"
          rules={{
            required: "Receive Amount is required",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receive Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormDescription>This is your receive amount.</FormDescription>
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
