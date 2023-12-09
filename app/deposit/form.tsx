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
import {
  getP2MContractAddress,
  getUSDCContractAddress,
  useP2MContractWrite,
} from "@/contract";
import { Check, Landmark, Loader, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { waitForTransaction } from "@wagmi/core";

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

          <div className="flex flex-col gap-6 items-center">
            <Button
              type="submit"
              size="lg"
              className={cn(
                "gap-2 w-fit",
                !window
                  ? ""
                  : isAllowed && !isAllowanceLoading
                  ? "flex"
                  : "hidden"
              )}
              disabled={isLoading || isSuccess || !form.formState.isDirty}
            >
              {isLoading ? (
                <Loader className="animate-spin w-6 h-6" />
              ) : (
                <Landmark className="w-6 h-6" />
              )}
              Deposit
            </Button>

            {isSuccess ? (
              <p className="flex items-center gap-1 text-xl font-bold text-primary/90">
                <Check className="w-6 h-6" />
                Your deposit is successful.
              </p>
            ) : null}
          </div>
        </form>
      </Form>

      <div className="flex flex-col gap-6 items-center">
        {!isAllowed && !isAllowanceLoading ? (
          <Button
            className="gap-2 w-fit"
            size="lg"
            disabled={isAllowed || isApproving || isAllowanceLoading}
            onClick={() => allow(100)}
          >
            {isApproving ? (
              <Loader className="animate-spin w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
            Approve USDC
          </Button>
        ) : null}

        <div>
          {isAllowanceLoading ? (
            <Loader className="animate-spin w-6 h-6" />
          ) : null}
        </div>
      </div>
    </>
  );
};

const useAllowance = () => {
  const [isApproving, setIsApproving] = useState(false);

  const { address } = useAccount();
  const { chain } = useNetwork();

  const {
    data,
    isLoading: isAllowanceLoading,
    refetch,
  } = useContractRead({
    address: getUSDCContractAddress(chain?.id),
    abi: erc20ABI,
    functionName: "allowance",
    args: [
      address as unknown as `0x${string}`,
      getP2MContractAddress(chain?.id),
    ],
    watch: true,
  });

  const isAllowed = useMemo(() => {
    if (data && data > BigInt(0)) {
      return true;
    }

    return false;
  }, [data]);

  const { writeAsync: usdcWriteAsync } = useContractWrite({
    address: getUSDCContractAddress(chain?.id),
    abi: erc20ABI,
    functionName: "approve",
  });

  const { toast } = useToast();

  const handleAllowance = async (amount: number) => {
    setIsApproving(true);

    console.log("allowance");
    try {
      const res = await usdcWriteAsync({
        args: [
          getP2MContractAddress(chain?.id),
          BigInt(amount * Math.pow(10, 6)),
        ],
      });

      if (res?.hash) {
        await waitForTransaction({
          hash: res?.hash,
        });
      }

      toast({
        title: "Token approved",
        variant: "accent",
      });

      setIsApproving(false);

      refetch();
    } catch {
      setIsApproving(false);
    }

    setIsApproving(false);
  };

  return {
    isAllowanceLoading,
    isAllowed,
    isApproving,
    allow: handleAllowance,
  };
};
