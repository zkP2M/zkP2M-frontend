"use client";

import { getP2MContractAddress, getUSDCContractAddress } from "@/contract";
import { useEffect, useState } from "react";
import { goerli, hardhat } from "wagmi/chains";

export const NetworkList = () => {
  const [networks, setNetworks] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== undefined) {
      setTimeout(() => {
        setNetworks([hardhat, goerli]);
      }, 200);
    }
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {networks.map((n) => (
        <div key={n.id} className="flex flex-col gap-4">
          <p className="text-foreground/90 font-medium">
            {n.name} ({n.id})
          </p>

          <p className="text-sm text-foreground/80 font-mono">
            P2M: {getP2MContractAddress(n.id)}
          </p>
          <p className="text-sm text-foreground/80 font-mono">
            USDC: {getUSDCContractAddress(n.id)}
          </p>
        </div>
      ))}
    </div>
  );
};
