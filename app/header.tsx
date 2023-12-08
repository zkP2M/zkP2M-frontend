import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => (
  <header className="flex items-center justify-between p-8">
    <h1 className="text-2xl font-bold">ZK P2M</h1>
    <div className="flex items-center justify-between space-x-4">
      <ConnectButton />
    </div>
  </header>
);
