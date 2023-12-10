"use client";

import * as React from "react";
import Link from "next/link";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export const Header = () => (
  <header className="flex items-center justify-between p-8 flex-col gap-6 lg:flex-row">
    <div className="flex items-center gap-6">
      <Link
        className="text-2xl font-bold transition-all hover:text-foreground hover:scale-105 hover:shadow-xl hover:-translate-y-1 rounded-full active:translate-y-0.5 active:scale-95"
        href="/"
      >
        <LogoSvg />
      </Link>

      <div className="w-fit bg-foreground p-2 rounded-lg">
        <HeaderNavigationMenu />
      </div>
    </div>

    <div className="flex items-center justify-between space-x-4">
      <ConnectButton />
    </div>
  </header>
);

const components: { title: string; href: string; description: string }[] = [
  {
    title: "User Registration",
    href: "/register/user",
    description: `Register as a User. Enter your full name.`,
  },
  {
    title: "Merchant Registration",
    href: "/register/merchant",
    description:
      "Register as a Merchant. Enter your RazorPay Read-only API Key.",
  },
];

const HeaderNavigationMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Register</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-foreground">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/deposit" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Deposit
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href = "", ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "h-full block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-background/20 hover:text-accent-foreground focus:bg-background/20 focus:text-accent-foreground",
            className
          )}
          href={href}
          {...props}
        >
          <div className="text-sm font-medium text-background/90 leading-none">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-background/60">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const LogoSvg = () => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
  >
    <mask
      id=":rfm:"
      mask-type="alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="80"
      height="80"
    >
      <rect width="80" height="80" rx="160" fill="#FFFFFF"></rect>
    </mask>
    <g mask="url(#:rfm:)">
      <rect width="10" height="10" fill="#0a0310"></rect>
      <rect x="20" width="10" height="10" fill="#0a0310"></rect>
      <rect x="40" width="10" height="10" fill="#49007e"></rect>
      <rect x="60" width="10" height="10" fill="#0a0310"></rect>
      <rect x="10" width="10" height="10" fill="#0a0310"></rect>
      <rect x="30" width="10" height="10" fill="#ffb238"></rect>
      <rect x="50" width="10" height="10" fill="#49007e"></rect>
      <rect x="70" width="10" height="10" fill="#ffb238"></rect>
      <rect y="10" width="10" height="10" fill="#ff005b"></rect>
      <rect y="20" width="10" height="10" fill="#0a0310"></rect>
      <rect y="30" width="10" height="10" fill="#ffb238"></rect>
      <rect y="40" width="10" height="10" fill="#ffb238"></rect>
      <rect y="50" width="10" height="10" fill="#0a0310"></rect>
      <rect y="60" width="10" height="10" fill="#ff7d10"></rect>
      <rect y="70" width="10" height="10" fill="#0a0310"></rect>
      <rect x="20" y="10" width="10" height="10" fill="#ffb238"></rect>
      <rect x="20" y="20" width="10" height="10" fill="#49007e"></rect>
      <rect x="20" y="30" width="10" height="10" fill="#49007e"></rect>
      <rect x="20" y="40" width="10" height="10" fill="#ff7d10"></rect>
      <rect x="20" y="50" width="10" height="10" fill="#0a0310"></rect>
      <rect x="20" y="60" width="10" height="10" fill="#49007e"></rect>
      <rect x="20" y="70" width="10" height="10" fill="#ffb238"></rect>
      <rect x="40" y="10" width="10" height="10" fill="#ff005b"></rect>
      <rect x="40" y="20" width="10" height="10" fill="#ffb238"></rect>
      <rect x="40" y="30" width="10" height="10" fill="#0a0310"></rect>
      <rect x="40" y="40" width="10" height="10" fill="#ff7d10"></rect>
      <rect x="40" y="50" width="10" height="10" fill="#ff005b"></rect>
      <rect x="40" y="60" width="10" height="10" fill="#ff7d10"></rect>
      <rect x="40" y="70" width="10" height="10" fill="#0a0310"></rect>
      <rect x="60" y="10" width="10" height="10" fill="#0a0310"></rect>
      <rect x="60" y="20" width="10" height="10" fill="#ff005b"></rect>
      <rect x="60" y="30" width="10" height="10" fill="#0a0310"></rect>
      <rect x="60" y="40" width="10" height="10" fill="#ffb238"></rect>
      <rect x="60" y="50" width="10" height="10" fill="#ff7d10"></rect>
      <rect x="60" y="60" width="10" height="10" fill="#0a0310"></rect>
      <rect x="60" y="70" width="10" height="10" fill="#49007e"></rect>
      <rect x="10" y="10" width="10" height="10" fill="#ffb238"></rect>
      <rect x="10" y="20" width="10" height="10" fill="#ff005b"></rect>
      <rect x="10" y="30" width="10" height="10" fill="#49007e"></rect>
      <rect x="10" y="40" width="10" height="10" fill="#0a0310"></rect>
      <rect x="10" y="50" width="10" height="10" fill="#ff005b"></rect>
      <rect x="10" y="60" width="10" height="10" fill="#ff005b"></rect>
      <rect x="10" y="70" width="10" height="10" fill="#ffb238"></rect>
      <rect x="30" y="10" width="10" height="10" fill="#ffb238"></rect>
      <rect x="30" y="20" width="10" height="10" fill="#0a0310"></rect>
      <rect x="30" y="30" width="10" height="10" fill="#0a0310"></rect>
      <rect x="30" y="40" width="10" height="10" fill="#ffb238"></rect>
      <rect x="30" y="50" width="10" height="10" fill="#ffb238"></rect>
      <rect x="30" y="60" width="10" height="10" fill="#ff005b"></rect>
      <rect x="30" y="70" width="10" height="10" fill="#0a0310"></rect>
      <rect x="50" y="10" width="10" height="10" fill="#49007e"></rect>
      <rect x="50" y="20" width="10" height="10" fill="#ffb238"></rect>
      <rect x="50" y="30" width="10" height="10" fill="#49007e"></rect>
      <rect x="50" y="40" width="10" height="10" fill="#ffb238"></rect>
      <rect x="50" y="50" width="10" height="10" fill="#0a0310"></rect>
      <rect x="50" y="60" width="10" height="10" fill="#49007e"></rect>
      <rect x="50" y="70" width="10" height="10" fill="#ff7d10"></rect>
      <rect x="70" y="10" width="10" height="10" fill="#0a0310"></rect>
      <rect x="70" y="20" width="10" height="10" fill="#0a0310"></rect>
      <rect x="70" y="30" width="10" height="10" fill="#0a0310"></rect>
      <rect x="70" y="40" width="10" height="10" fill="#49007e"></rect>
      <rect x="70" y="50" width="10" height="10" fill="#ff005b"></rect>
      <rect x="70" y="60" width="10" height="10" fill="#ff7d10"></rect>
      <rect x="70" y="70" width="10" height="10" fill="#ff005b"></rect>
    </g>
  </svg>
);
