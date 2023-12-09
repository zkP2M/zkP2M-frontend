import { useContractRead, useNetwork, useWalletClient } from "wagmi";
import ABI from "./abi.json";
import { useState } from "react";
import { prepareWriteContract, readContract, writeContract } from "@wagmi/core";
import { useToast } from "@/components/ui/use-toast";
import { ERR_MSG } from "@/lib/consts";

export const getP2MContractAddress = (chainId: number | undefined) => {
  switch (chainId) {
    case 1:
      return process.env.NEXT_PUBLIC_ZKP2M_CONTRACT_ADDRESS_1 as `0x${string}`;
    case 5:
      return process.env.NEXT_PUBLIC_ZKP2M_CONTRACT_ADDRESS_5 as `0x${string}`;
    case 42:
      return process.env.NEXT_PUBLIC_ZKP2M_CONTRACT_ADDRESS_42 as `0x${string}`;
    case 1337:
      return process.env
        .NEXT_PUBLIC_ZKP2M_CONTRACT_ADDRESS_1337 as `0x${string}`;
    case 31337:
      return process.env
        .NEXT_PUBLIC_ZKP2M_CONTRACT_ADDRESS_31337 as `0x${string}`;
    default:
      return process.env.NEXT_PUBLIC_ZKP2M_CONTRACT_ADDRESS_1 as `0x${string}`;
  }
};

export const getUSDCContractAddress = (chainId: number | undefined) => {
  switch (chainId) {
    case 1:
      return process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS_1 as `0x${string}`;
    case 5:
      return process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS_5 as `0x${string}`;
    case 42:
      return process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS_42 as `0x${string}`;
    case 1337:
      return process.env
        .NEXT_PUBLIC_USDC_CONTRACT_ADDRESS_1337 as `0x${string}`;
    case 31337:
      return process.env
        .NEXT_PUBLIC_USDC_CONTRACT_ADDRESS_31337 as `0x${string}`;
    default:
      return process.env.NEXT_PUBLIC_ZKP2M_CONTRACT_ADDRESS_1 as `0x${string}`;
  }
};

export const useP2MContractRead = (
  functionName: string,
  { args, enabled, watch }: any
) => {
  const { chain } = useNetwork();

  return useContractRead({
    address: getP2MContractAddress(chain?.id),
    abi: ABI.abi,
    functionName,
    args,
    enabled,
    watch,
  });
};

type ContractWriteOptions = {
  noToast?: boolean;
};

export const useP2MContractWrite = (
  functionName: string,
  options?: ContractWriteOptions
) => {
  const [data, setData] = useState<any>(undefined);

  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>(undefined);

  const { data: walletClient } = useWalletClient();

  const { toast } = useToast();

  const { chain } = useNetwork();

  const writeAsync = async (args: any[]) => {
    setLoading(true);

    try {
      if (!walletClient) {
        throw new Error("Wallet client not found");
      }

      const config = await prepareWriteContract({
        address: getP2MContractAddress(chain?.id),
        abi: ABI.abi,
        functionName,
        args,
      });

      const res = await writeContract(config);

      // const { request } = await publicClient.simulateContract({
      //   address: P2M_CONTRACT_ADDRESS,
      //   abi: ABI.abi,
      //   functionName,
      //   args,
      //   account: address,
      // });
      // console.log(request);

      // const res = await walletClient.writeContract(request);

      console.log(res);

      setData(res);

      setIsSuccess(true);
      setLoading(false);
      setIsError(false);
      setError(null);

      if (!options?.noToast) {
        toast({
          title: "Transaction Success",
          variant: "accent",
        });
      }

      return res;
    } catch (err) {
      console.log("useP2MContractWrite: ", err);

      setError(err);
      setIsError(true);

      setIsSuccess(false);
      setLoading(false);

      setData(undefined);

      if (!options?.noToast) {
        toast({
          title: "Transaction failed!",
          description: ERR_MSG,
          variant: "destructive",
        });
      }
    }
  };

  return { writeAsync, isError, isLoading, isSuccess, error, data };
};

export const useReadDynamicP2MContract = (functionName: string) => {
  const { chain } = useNetwork();

  const readAsync = async (args: any[]) => {
    try {
      const data = await readContract({
        address: getP2MContractAddress(chain?.id),
        abi: ABI.abi,
        functionName,
        args,
      });

      console.log("read", data);

      return data;
    } catch (err) {
      console.log("useReadDynamicP2MContract: ", err);
    }
  };

  return { readAsync };
};
