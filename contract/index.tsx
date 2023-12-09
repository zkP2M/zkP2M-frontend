import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import ABI from "./abi.json";

export const P2M_CONTRACT_ADDRESS = "0x3824";
export const P2M_CONTRACT_ABI = ABI;

export const useP2MContractWrite = (functionName: string) => {
  const { config } = usePrepareContractWrite({
    address: P2M_CONTRACT_ADDRESS,
    abi: P2M_CONTRACT_ABI,
    functionName: functionName as unknown as undefined,
  });

  return useContractWrite(config);
};

export const useP2MContractRead = (functionName: string) => {
  return useContractRead({
    address: P2M_CONTRACT_ADDRESS,
    abi: P2M_CONTRACT_ABI,
    functionName: functionName as unknown as undefined,
  });
};
