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
import { P2M_CONTRACT_ADDRESS, useP2MContractWrite } from "@/contract";
import { Check, Loader } from "lucide-react";
import { useMemo, useState } from "react";
import { erc20ABI, useAccount, useContractRead, useContractWrite } from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  upiId: z.string(),
  amount: z.string(),
  receiveAmount: z.string(),
});

export const DepositForm = () => {
  const { isAllowed, allow, isAllowanceLoading, isApproving } = useAllowance();

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
      values.upiId,
      String(Number(values.amount) * Math.pow(10, 6)),
      String(Number(values.receiveAmount) * Math.pow(10, 6)),
    ];

    await writeAsync(args);
  };

  return (
    <>
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
            size="lg"
            className={cn(
              "gap-2 w-full",
              !window
                ? ""
                : isAllowed && !isAllowanceLoading
                ? "flex"
                : "hidden"
            )}
            disabled={isLoading || isSuccess || !form.formState.isDirty}
          >
            {isLoading ? <Loader className="animate-spin w-4 h-4" /> : null}
            Submit
          </Button>

          {isSuccess ? (
            <p className="flex items-center gap-1 text-sm font-medium text-primary/90">
              <Check className="w-4 h-4" />
              Your deposit is successful.
            </p>
          ) : null}
        </form>
      </Form>

      {!isAllowed && !isAllowanceLoading ? (
        <Button
          className="gap-2"
          size="lg"
          disabled={isAllowed || isApproving || isAllowanceLoading}
          onClick={() => allow(10)}
        >
          {isApproving ? <Loader className="animate-spin w-4 h-4" /> : null}
          Allow
        </Button>
      ) : null}

      <div>
        {isAllowanceLoading ? (
          <Loader className="animate-spin w-4 h-4" />
        ) : null}
      </div>
    </>
  );
};

const useAllowance = () => {
  const { address } = useAccount();

  const {
    data,
    isLoading: isAllowanceLoading,
    refetch,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_USDC_CONTRACT as `0x${string}`,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address as unknown as `0x${string}`, P2M_CONTRACT_ADDRESS],
    watch: true,
  });

  const isAllowed = useMemo(() => {
    if (data && data > BigInt(0)) {
      return true;
    }

    return false;
  }, [data]);

  const { writeAsync: usdcWriteAsync, isLoading: isApproving } =
    useContractWrite({
      address: process.env.NEXT_PUBLIC_USDC_CONTRACT as `0x${string}`,
      abi: erc20ABI,
      functionName: "approve",
    });

  const { toast } = useToast();

  const handleAllowance = async (amount: number) => {
    console.log("allowance");
    try {
      await usdcWriteAsync({
        args: [P2M_CONTRACT_ADDRESS, BigInt(amount * Math.pow(10, 6))],
      });

      toast({
        title: "Token approved",
        variant: "accent",
      });

      refetch();
    } catch {}
  };

  return {
    isAllowanceLoading,
    isAllowed,
    isApproving,
    allow: handleAllowance,
  };
};
