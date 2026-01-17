import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
  {
    group: "Quick Links",
    items: [
      {
        title: "About Us",
        href: "/about",
      },
      {
        title: "Investor Relation",
        href: "/investor-relation",
      },
      {
        title: "How to list your Business",
        href: "/how-to-list-your-business",
      },
      {
        title: "How to make your Hire Profile",
        href: "/how-to-make-your-hire-profile",
      },
      {
        title: "Create your own Offers",
        href: "/create-your-own-offers",
      },
    ],
  },
  {
    group: "Legal Policy",
    items: [
      {
        title: "Privacy Policy",
        href: "/privacy-policy",
      },
      {
        title: "Terms & Conditions",
        href: "/terms-and-conditions",
      },
      {
        title: "Premium Plans",
        href: "/pricing-plans",
      },
    ],
  },
  {
    group: "Contact Us",
    items: [
      {
        title: "+919214300555",
        href: "tel:+919214300555",
      },
      {
        title: "justsearch.help@gmail.com ",
        href: "mailto:justsearch.help@gmail.com",
      },
    ],
  },
];

export default function FooterSection() {
  return (
    <footer className="border-b bg-white pt-20 dark:bg-transparent border-t ">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" aria-label="go home" className="block size-fit">
              <Logo />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:col-span-3">
            {links.map((link, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <div key={index} className="space-y-4 text-sm">
                <span className="block text-lg font-bold text-primary">
                  {link.group}
                </span>
                {link.items.map((item, index) => (
                  <Link
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary block duration-150"
                  >
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
          <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
            COPYRIGHT © 2025. All Rights Reserved By Justsearch.net.in
          </span>
        </div>
      </div>
    </footer>
  );
}
