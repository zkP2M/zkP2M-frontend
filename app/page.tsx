import { Metadata } from "next";
import { Swap } from "./swap";

export const metadata: Metadata = {
  title: "ZK P2M",
  description: "Zero Knowledge - Peer to Merchant",
};

export default function Home() {
  return (
    <div className="w-full">
      {/* <div className="p-12 rounded-xl border-[20px] border-foreground/10"> */}
      <Swap />
      {/* </div> */}
    </div>
  );
}
