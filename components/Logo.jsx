import { alt } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ size = 32, onlyLogo = false, className = "" }) {
  return (
    <Link
      href="/"
      className={cn("flex hover:no-underline items-center gap-2", className)}
    >
      <Image
        className={className}
        // style={{
        //   objectFit: "contain",
        // }}
        src="/logo.png"
        alt={alt}
        width={size}
        height={size}
      />
      {!onlyLogo && <div className="text-2xl font-bold ">Focusmo</div>}
    </Link>
  );
}
