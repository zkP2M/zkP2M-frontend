"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useP2MContractRead, useP2MContractWrite } from "@/contract";
import { useCallback, useMemo, useState } from "react";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { useAccount } from "wagmi";

const RAZOR_API_KEY = "rzp_test_c4bTc9bMwdE8xe";

export const Swap = () => {
  const [usd, setUSD] = useState<number | undefined>(undefined);

  const { address } = useAccount();
  const { toast } = useToast();

  const { data } = useP2MContractRead("getDeposit", {
    args: [Number(usd) * Math.pow(10, 6)],
    enabled: !!usd,
  });

  const { isLoading, isError, writeAsync } =
    useP2MContractWrite("signalIntent");

  const [Razorpay] = useRazorpay();

  const inrValue = useMemo(() => {
    console.log("INR", data);
    return undefined;
  }, [data]);

  const onCreateOrderClick = useCallback(async () => {
    // 1) call signalIntent
    const highestInr = { id: "a" };

    try {
      if (!usd) {
        toast({
          title: "Error",
          description: "Please enter valid amount",
          variant: "destructive",
        });

        return;
      }

      if (!address) {
        toast({
          title: "Error",
          description: "Please connect your wallet",
          variant: "destructive",
        });

        return;
      }

      const args = [highestInr.id, usd, address];
      const writeRes = await writeAsync(args);

      // 2) get intentHash
      const intentHash = "HASH";

      // 3) call createOrder & get orderId
      const res = await fetch(`/order`, {
        method: "POST",
        body: JSON.stringify({
          amount: 3000,
          currency: "INR",
          id: intentHash,
        }),
      });

      const resJson = await res.json();
      console.log(resJson);

      const order = { id: resJson.orderId };

      // 4) do payment
      const options: RazorpayOptions = {
        key: RAZOR_API_KEY,
        amount: "3000",
        currency: "INR",
        name: "ZKP2M",
        description: "Transaction",
        order_id: order.id,
        handler: (res) => {
          console.log(res);
        },
        notes: {
          id: intentHash,
        },
      };

      const rzpay = new Razorpay(options);
      rzpay.open();

      // 5) pass to webhook
    } catch (err) {}
  }, [Razorpay]);

  return (
    <div className="flex flex-col gap-7">
      <h6 className="text-4xl font-bold ">Swap</h6>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between p-6 w-full h-24 rounded-lg border border-foreground/30 text-foreground/70 focus-within:border-foreground/60 focus-within:text-foreground/80 transition-all">
          <div className="flex flex-col gap-2">
            <h6 className="text-sm font-medium">Requesting</h6>
            <Input
              type="number"
              className="border-0 focus:active:focus-visible:border-0 text-4xl font-bold px-0 focus:ring-0 active:ring-0 focus-visible:ring-0"
              placeholder="0"
              value={usd}
              onChange={(e) => setUSD(Number(e.target.value) || undefined)}
            />
          </div>

          <div>
            <p className="font-semibold text-lg">USDC</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 w-full h-24 rounded-lg border border-foreground/30 text-foreground/70 focus-within:border-foreground/60 focus-within:text-foreground/80 transition-all">
          <div className="flex flex-col gap-2">
            <h6 className="text-sm font-medium">Giving Away</h6>
            <Input
              type="number"
              className="border-0 focus:active:focus-visible:border-0 text-4xl font-bold px-0 focus:ring-0 active:ring-0 focus-visible:ring-0"
              placeholder="0"
              value={inrValue}
              disabled
            />
          </div>

          <div>
            <p className="font-semibold text-lg">INR</p>
          </div>
        </div>
      </div>

      <Button size="lg" onClick={onCreateOrderClick}>
        Create Order
      </Button>
    </div>
  );
};
