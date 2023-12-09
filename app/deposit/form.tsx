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
  const { isLoading, isError, isSuccess, error, writeAsync } =
    useP2MContractWrite("offRamp");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      upiId: "",
      amount: "",
      receiveAmount: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    const args = [
      //   values.upiId,
      //   values.amount.toString(),
      //   values.receiveAmount.toString(),

      "sachin@paytm",
      "10000000",
      "830000000",
    ];

    await writeAsync(args);
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

        <Button
          type="submit"
          className="gap-2"
          disabled={isLoading || isSuccess || !form.formState.isDirty}
        >
          {isLoading ? <Loader className="animate-spin w-4 h-4" /> : null}
          Submit
        </Button>
      </form>
    </Form>
  );
};
