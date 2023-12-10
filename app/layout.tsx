"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

import { QueryClient, QueryClientProvider } from "react-query";

import "@rainbow-me/rainbowkit/styles.css";

import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli, hardhat, scroll } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { Header } from "./header";

import localFont from "next/font/local";
import { Footer } from "./footer";

const queryClient = new QueryClient();

const { chains, publicClient } = configureChains(
  [scroll, hardhat, goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "ZKP2M",
  projectId: "459d5c157295ebdfe3ad924728ac582c",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const satoshi = localFont({
  src: "../fonts/satoshi.ttf",
  variable: "--font-satoshi",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          // inter.variable,
          satoshi.variable,
          satoshi.className,
          "min-h-screen bg-background font-[--font-satoshi] antialiased"
        )}
      >
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} theme={darkTheme()}>
            <QueryClientProvider client={queryClient}>
              <div className="flex flex-col w-full min-h-[calc(100vh+1px)] h-full">
                <div className="border-b border-b-foreground/40 flex justify-center bg-foreground/10">
                  <h1 className="font-black text-foreground/90 text-2xl py-4">
                    ZKP2M
                  </h1>
                </div>

                {/* <div className="border-b border-b-foreground/40"> */}
                <Header />
                {/* </div> */}

                <div className="w-full max-w-2xl px-4 mb-6 mx-auto flex flex-col gap-6 mt-4">
                  {children}
                </div>

                <div className="border-t border-t-foreground/40 mt-auto">
                  <Footer />
                </div>
              </div>
            </QueryClientProvider>
          </RainbowKitProvider>
        </WagmiConfig>

        <Toaster />
      </body>
    </html>
  );
}
