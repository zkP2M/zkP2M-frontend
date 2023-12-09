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

const queryClient = new QueryClient();

const { chains, publicClient } = configureChains(
  [scroll, hardhat, goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
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
              <Header />

              <div className="max-w-xl mx-auto flex flex-col gap-6 mt-20">
                {children}
              </div>
            </QueryClientProvider>
          </RainbowKitProvider>
        </WagmiConfig>

        <Toaster />
      </body>
    </html>
  );
}
