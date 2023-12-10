"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  getP2MContractAddress,
  useP2MContractRead,
  useP2MContractWrite,
  useReadDynamicP2MContract,
} from "@/contract";
import { useCallback, useMemo, useState } from "react";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { useAccount, useNetwork } from "wagmi";
import { Check, Loader, ShuffleIcon } from "lucide-react";
import { ERR_MSG } from "@/lib/consts";
import { waitForTransaction } from "@wagmi/core";

const RAZOR_API_KEY = process.env.NEXT_PUBLIC_KEY_ID;

type Actions = {
  steps: string[];
  finished?: boolean;
};

export const Swap = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isActionSuccess, setIsActionSuccess] = useState(false);

  const { chain } = useNetwork();

  const [actions, setActions] = useState<Actions>({
    steps: [],
    finished: false,
  });

  const addNewAction = useCallback(
    (step: string) => {
      setActions((prev) => ({ ...prev, steps: [...prev.steps, step] }));
    },
    [setActions]
  );

  const finishActions = useCallback(() => {
    setActions((prev) => ({ ...prev, finished: true }));
  }, []);

  const [usd, setUSD] = useState<number | string>("");

  const { address } = useAccount();
  const { toast } = useToast();

  const { readAsync: readDepositor } = useReadDynamicP2MContract("getDeposit");
  const { readAsync: readIntentHash } = useReadDynamicP2MContract(
    "getIdCurrentIntentHash"
  );

  const { data, isLoading: bestRateLoading } = useP2MContractRead(
    "getBestRate",
    {
      args: [Number(usd) * Math.pow(10, 6)],
      enabled: !!usd,
      watch: true,
    }
  );

  const { isLoading, isError, writeAsync } = useP2MContractWrite(
    "signalIntent",
    { noToast: true }
  );

  const [Razorpay] = useRazorpay();

  const inrValue = useMemo(() => {
    if (!data) return 0;

    console.log();

    const num = (data as any)[1] as unknown as BigInt;

    const USD_INR = 83.43;

    // const inr = BigNumber.from(usd)
    // .mul(BigNumber.from(num))
    // .div(BigNumber.from(10).pow(18))
    // .toNumber();

    return (Number(usd) * USD_INR).toFixed(2);
  }, [data]);

  const onCreateOrderClick = useCallback(async () => {
    setActions({ steps: [], finished: false });

    try {
      setIsActionLoading(true);

      // 1) call signalIntent
      console.log("data", data);

      const depositerId =
        ((data as any)?.[0] as unknown as BigInt) || BigInt(0);

      if (depositerId === undefined) {
        setIsActionLoading(false);

        toast({
          title: "Error",
          description: "No depositor found!",
          variant: "destructive",
        });

        return;
      }

      addNewAction("Fetching the best depositor");

      const depositor = await readDepositor([depositerId]);
      console.log("depositor", depositor);

      // ACTION

      if (!usd) {
        setIsActionLoading(false);

        toast({
          title: "Error",
          description: "Please enter valid amount",
          variant: "destructive",
        });

        return;
      }

      if (!address) {
        setIsActionLoading(false);

        toast({
          title: "Error",
          description: "Please connect your wallet",
          variant: "destructive",
        });

        return;
      }

      addNewAction(`Creating an order against depositor id: ${depositerId}`);

      const args = [depositerId, Number(usd) * Math.pow(10, 6), address];
      const writeRes = await writeAsync(args);

      console.log("signalIntent", writeRes);

      if (!writeRes) {
        setIsActionLoading(false);

        return;
      }

      addNewAction("Waiting for transaction to mine");

      await waitForTransaction({
        hash: writeRes?.hash,
      });

      // addNewAction("fetch intent hash");

      // 2) get intentHash & depositor
      // const intentHash = writeRes.hash;
      const intentHash = await readIntentHash([address]);
      console.log("intentHash", intentHash);

      addNewAction(`Create Razorpay order`); // with hash: ${intentHash}

      // 3) call createOrder & get orderId
      const res = await fetch(`/order`, {
        method: "POST",
        body: JSON.stringify({
          amount: `${inrValue}`,
          currency: "INR",
          id: intentHash,
        }),
      });

      const resJson = await res.json();
      console.log(resJson);

      const order = { id: resJson.orderId };

      // 4) do payment

      if (!depositor) {
        setIsActionLoading(false);

        toast({
          title: "Error",
          description: "Couldn't find depositor with the ID",
          variant: "destructive",
        });

        return;
      }

      const options: RazorpayOptions = {
        key: `${RAZOR_API_KEY}`,
        amount: inrValue.toString(),
        currency: "INR",
        name: "ZKP2M",
        description: "Transaction",
        order_id: order.id,
        prefill: {
          method: "upi",
        },
        handler: (res) => {
          console.log(res);

          toast({
            title: "Swap successfull",
            variant: "accent",
          });

          addNewAction(`Payment successfull, generating proof (15 seconds).`);

          // 5) pass to webhook
          fetch("https://proof.codes/zk", {
            mode: "no-cors",
            method: "POST",
            body: JSON.stringify(res),
            headers: {
              "Content-Type": "application/json",
            },
          });

          setIsActionLoading(false);
          setIsActionSuccess(true);

          addNewAction(
            `Contract: ${`https://goerli.etherscan.io/${getP2MContractAddress(
              chain?.id
            )}`} `
          );
        },
        notes: {
          id: intentHash,
        },
      };

      addNewAction(`open payment gateway`);

      const rzpay = new Razorpay(options);
      rzpay.open();

      // 6) success
    } catch (err) {
      setIsActionLoading(false);

      console.log("onCreateOrderClick", err);

      toast({
        title: "Swap failed",
        description: ERR_MSG,
        variant: "destructive",
      });
    }

    setIsActionLoading(false);
    finishActions();
  }, [Razorpay, usd]);

  return (
    <div className="flex flex-col gap-7">
      <h6 className="text-4xl font-black px-2 py-3 bg-foreground/5 rounded-sm w-fit">
        Swap
      </h6>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between p-6 w-full h-24 rounded-lg border-2 border-foreground/30 text-foreground/70 focus-within:border-foreground/60 focus-within:text-foreground/80 transition-all shadow-md">
          <div className="flex flex-col gap-2">
            <h6 className="text-sm font-semibold">Requesting</h6>
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

      <div className="flex flex-col gap-6 items-center">
        <Button
          size="lg"
          className="gap-2 w-fit"
          onClick={onCreateOrderClick}
          disabled={
            !usd || bestRateLoading || isActionLoading || isActionSuccess
          }
        >
          {isActionLoading ? (
            <Loader className="animate-spin w-6 h-6" />
          ) : (
            <ShuffleIcon className="w-6 h-6" />
          )}
          Create Order
        </Button>

        {isActionSuccess ? (
          <p className="flex items-center gap-1 text-sm font-medium text-primary/90">
            <Check className="w-4 h-4" />
            Your swap is successful.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1 mb-12">
        {actions.steps.map((step, index) => (
          <div
            key={index}
            className="w-full border border-foreground/30 bg-foreground/5 p-2 rounded-lg flex items-center gap-2 overflow-hidden"
          >
            {index === actions.steps.length && !actions.finished ? (
              <Loader className="animate-spin w-6 h-6" />
            ) : (
              <Check className="w-6 h-6 min-w-[1.5rem]" />
            )}
            <p className="text-emerald-800 font-bold">{step}</p>
          </div>
        ))}

        {isError ? (
          <div className="w-full border border-foreground/30 bg-foreground/5 p-2 rounded-lg flex items-center gap-2">
            <p className="text-destructive font-bold">
              Error processing order transaction!
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
