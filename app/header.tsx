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
  <header className="flex items-center justify-between p-8">
    <div className="flex items-center gap-6">
      <Link
        className="text-2xl font-bold transition-all hover:text-foreground"
        href="/"
      >
        ZKP2M
      </Link>

      <HeaderNavigationMenu />

      {/* <div className="w-full flex gap-4 items-center">
        <Link
          className="text-foreground/80 font-medium text-sm transition-all hover:text-foreground"
          href="/register"
        >
          Register
        </Link>

        <Link
          className="text-foreground/70 font-medium text-sm transition-all hover:text-foreground"
          href="/deposit"
        >
          Deposit
        </Link>
      </div> */}
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
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Merchant Registration",
    href: "/register/merchant",
    description:
      "For sighted users to preview content available behind a link.",
  },
];

const HeaderNavigationMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}

        <NavigationMenuItem>
          <NavigationMenuTrigger>Register</NavigationMenuTrigger>
          <NavigationMenuContent>
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
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
