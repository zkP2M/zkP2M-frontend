"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Swap = () => {
  const onUSDChange = () => {};

  const onINRChange = () => {};

  const onIntent = () => {
    console.log("onIntent");
  };

  return (
    <div className="w-full max-w-xl flex flex-col gap-7">
      <h6 className="text-2xl font-bold ">Swap</h6>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between p-6 w-full h-24 rounded-lg border border-slate-700 text-slate-300 focus-within:border-slate-400 focus-within:text-slate-200 transition-all">
          <div className="flex flex-col gap-2">
            <h6 className="text-sm font-medium">Requesting</h6>
            <Input
              type="number"
              className="border-0 focus:active:focus-visible:border-0 text-4xl font-bold px-0 focus:ring-0 active:ring-0 focus-visible:ring-0"
              placeholder="0"
            />
          </div>

          <div>
            <p className="font-semibold text-lg">USDC</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 w-full h-24 rounded-lg border border-slate-700 text-slate-300 focus-within:border-slate-400 focus-within:text-slate-200 transition-all">
          <div className="flex flex-col gap-2">
            <h6 className="text-sm font-medium">Giving Away</h6>
            <Input
              type="number"
              className="border-0 focus:active:focus-visible:border-0 text-4xl font-bold px-0 focus:ring-0 active:ring-0 focus-visible:ring-0"
              placeholder="0"
            />
          </div>

          <div>
            <p className="font-semibold text-lg">INR</p>
          </div>
        </div>
      </div>

      <Button size="lg" onClick={onIntent}>
        Intent
      </Button>
    </div>
  );
};
