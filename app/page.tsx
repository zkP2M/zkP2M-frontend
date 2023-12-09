import Image from "next/image";
import { Header } from "./header";
import { Metadata } from "next";
import { Swap } from "./swap";
import { RazorPay } from "./razorpay";

export const metadata: Metadata = {
  title: "ZK P2M",
  description: "Zero Knowledge - Peer to Merchant",
};

export default function Home() {
  return (
    <>
      <Swap />
      {/* <RazorPay /> */}
    </>
  );
}
