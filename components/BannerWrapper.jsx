"use client";

import { usePathname } from "next/navigation";
import PromoBanner from "./PromoBanner";

export default function BannerWrapper() {
  const pathname = usePathname();

  return <PromoBanner currentPath={pathname} />;
}
