"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/vision", label: "Why" },
  { href: "/explore", label: "Explore" },
  { href: "/discover", label: "Discover" },
  { href: "/authority", label: "Authority" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="-mx-1 flex min-w-0 gap-4 overflow-x-auto px-1 text-sm text-ink-muted sm:gap-6">
      {LINKS.map((link) => {
        const here = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={here ? "page" : undefined}
            className={`shrink-0 border-b-2 pb-0.5 transition-colors duration-200 ${
              here ? "border-madder text-ink" : "border-transparent hover:text-madder"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
