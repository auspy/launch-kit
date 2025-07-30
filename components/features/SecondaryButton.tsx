"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
export default function SecondaryButton({
  text,
  href,
  icon = <ArrowRight className="w-4 h-4" />,
  className = "",
}) {
  if (!text || !href) {
    return null;
  }
  return (
    <div className={cn("text-center  md:-mt-8", className)}>
      <Button
        variant="ghost"
        asChild
        size="sm"
        className="border-primary -mt-8 w-fit text-primary text-xl hover:text-primary hover:bg-primary/10 focus:bg-primary/10"
      >
        <Link
          href={href}
          className="hover:no-underline flex font-semibold items-center  gap-1"
        >
          {text}
          {icon && icon}
        </Link>
      </Button>
    </div>
  );
}
