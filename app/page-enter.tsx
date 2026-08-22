"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// the key is the point of this: changing route remounts the tree, so the enter plays again
export default function PageEnter({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-enter flex min-h-0 flex-1 flex-col">
      {children}
    </div>
  );
}
