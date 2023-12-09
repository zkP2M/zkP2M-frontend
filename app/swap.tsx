"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useP2MContractRead, useP2MContractWrite } from "@/contract";
import { useCallback, useMemo, useState } from "react";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { useAccount } from "wagmi";
import { BigNumber } from "ethers";
import { Loader } from "lucide-react";
import { ERR_MSG } from "@/lib/consts";

const RAZOR_API_KEY = "rzp_test_c4bTc9bMwdE8xe";

export const Swap = () => {
  const [usd, setUSD] = useState<number | string>("");

  const { address } = useAccount();
  const { toast } = useToast();

  const { data, isLoading: bestRateLoading } = useP2MContractRead(
    "getBestRate",
    {
      args: [Number(usd) * Math.pow(10, 6)],
      enabled: !!usd,
    }
  );

  const { isLoading, isError, writeAsync } =
    useP2MContractWrite("signalIntent");

  const [Razorpay] = useRazorpay();

  const inrValue = useMemo(() => {
    if (!data) return 0;

    const num = (data as any)[1] as unknown as BigInt;

    const inr = BigNumber.from(usd)
      .mul(BigNumber.from(num))
      .div(BigNumber.from(10).pow(18))
      .toNumber();

    return inr;
  }, [data]);

  const onCreateOrderClick = useCallback(async () => {
    // 1) call signalIntent
    const highestDepositId = (data as any)[0] as unknown as BigInt;

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

      const args = [highestDepositId, usd, address];
      const writeRes = await writeAsync(args);

      console.log("signalIntent", writeRes);

      if (!writeRes) {
        return;
      }

      // 2) get intentHash
      const intentHash = writeRes.hash;

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
        amount: inrValue.toString(),
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

      toast({
        title: "Swap successfull",
        description: ERR_MSG,
        variant: "accent",
      });

      // 5) pass to webhook
    } catch (err) {
      console.log("onCreateOrderClick", err);

      toast({
        title: "Swap failed",
        description: ERR_MSG,
        variant: "destructive",
      });
    }
  }, [Razorpay, usd]);

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
              onChange={(e) => {
                const val = Number(e.target.value) || undefined;

                if (val && val > 10 * Math.pow(10, 12)) {
                  return;
                }

                setUSD(Number(e.target.value) || "");
              }}
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

      <Button
        size="lg"
        className="gap-2"
        onClick={onCreateOrderClick}
        disabled={!usd || bestRateLoading || isLoading}
      >
        {isLoading ? <Loader className="animate-spin w-4 h-4" /> : null}
        Create Order
      </Button>
    </div>
  );
};
