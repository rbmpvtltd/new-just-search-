"use client";
import Cookies from "js-cookie";
import { Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoIosNotifications, IoMdChatboxes } from "react-icons/io";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Hire", href: "/hire" },
  { name: "Offers", href: "/allOffers" },
  { name: "Favourite", href: "/favourite" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false);
  const data = Cookies.get("authenticated");

  return (
    <header className="sticky top-0 z-50">
      <nav
        data-state={menuState && "active"}
        className="bg-background/50 z-20 w-full border-b backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Image
                  src="/images/logo-v2.png"
                  alt="logo image"
                  width={100}
                  height={100}
                  style={{ objectFit: "contain" }}
                />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                type="button"
                aria-label={menuState === true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index.toString()}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span className="text-primary font-semibold">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-background absolute lg:static top-[calc(100%+1em)] w-full border-bl in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index.toString()}>
                      <Link
                        href={item.href}
                        className=" text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span className="text-primary">{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0 md:w-fit">
                {data && (
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-primary flex items-center justify-center border-2 border-primary"
                    >
                      <Link href="/chat">
                        <IoMdChatboxes size={18} />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-primary flex items-center justify-center border-2 border-primary"
                    >
                      <Link href="/profile">
                        <User size={18} />
                      </Link>
                    </Button>
                     <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-primary flex items-center justify-center border-2 border-primary"
                    >
                      <Link href="/notification">
                        <IoIosNotifications />
                      </Link>
                    </Button>
                  </div>
                )}
                {!data && (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-primary"
                    >
                      <Link href="/login">Login</Link>
                    </Button>

                    <Button asChild size="sm" className="bg-primary text-white">
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
