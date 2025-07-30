"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const PayDialog = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showPricing = searchParams.get("pricing") === "true";

  useEffect(() => {
    if (showPricing) {
      router.push("/pricing");
    }
  }, [showPricing, router]);

  return null;
};

export default PayDialog;
