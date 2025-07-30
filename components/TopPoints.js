import { cn } from "@/lib/utils";
import Image from "next/image";

const TopPoint = ({ label, align = "center" }) => {
  if (!label) {
    return null;
  }
  return (
    <div
      className={cn(
        `flex gap-1 items-center flex-row `,
        align === "center" ? "justify-center" : "justify-start"
      )}
    >
      <div className="border-2 bg-lightRed border-primary rounded-full relative p-1.5 h-3 w-3 ">
        <Image
          style={{
            objectFit: "contain",
          }}
          src="/tick.svg"
          alt="logo"
          fill="true"
        />
      </div>
      <div className=" text-sm md:text-base font-medium text-slate-800">
        {label}
      </div>
    </div>
  );
};
const TopPoints = ({ labels, align = "center" }) => {
  return (
    <div
      className={cn(
        `flex gap-x-2 gap-y-1 flex-wrap justify-center items-center flex-row`,
        align === "center" ? "justify-center" : "justify-start items-start"
      )}
    >
      {labels?.map((label, index) => (
        <TopPoint key={index} label={label} align={align} />
      ))}
    </div>
  );
};

export default TopPoints;
