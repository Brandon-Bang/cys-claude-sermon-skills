"use client";

import { useUi } from "@/lib/store";

export function ResponsiveWrapper({ children }: { children: React.ReactNode }) {
  const device = useUi((s) => s.device);
  const cls =
    "responsive-wrapper" +
    (device === "tablet" ? " mode-tablet" : device === "phone" ? " mode-phone" : "");
  return <div className={cls}>{children}</div>;
}
