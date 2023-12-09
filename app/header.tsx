import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export const Header = () => (
  <header className="flex items-center justify-between p-8">
    <div className="flex items-center gap-6">
      <Link
        className="text-2xl font-bold transition-all hover:text-slate-100"
        href="/"
      >
        ZKP2M
      </Link>

      <div className="w-full flex gap-4 items-center">
        <Link
          className="text-slate-300 font-medium text-sm transition-all hover:text-slate-100"
          href="/register"
        >
          Register
        </Link>

        <Link
          className="text-slate-300 font-medium text-sm transition-all hover:text-slate-100"
          href="/deposit"
        >
          Deposit
        </Link>
      </div>
    </div>

    <div className="flex items-center justify-between space-x-4">
      <ConnectButton />
    </div>
  </header>
);
