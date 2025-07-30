import FeatureVideo from "./FeatureVideo";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  title: string | JSX.Element;
  description: string | JSX.Element;
  imageUrl: string;
  imageAlt: string;
  isImageLeft: boolean;
  textColor?: string;
  className?: string;
  gradientPosition?: string;
  solvedIssue?: string;
  height?: number;
  width?: number;
  feature?: string;
  headingType?: "h2" | "h3";
}

export default function FeatureListItem({
  isImageLeft,
  imageUrl,
  imageAlt,
  title,
  solvedIssue,
  description,
  textColor,
  className,
  gradientPosition,
  height,
  width,
  feature,
  headingType = "h2",
}: Props) {
  return (
    <>
      <div
        className={` w-full mx-auto flex flex-col  ${
          isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        }  items-start gap-6 md:gap-12 `}
      >
        <div className="w-full lg:w-1/2">
          <FeatureVideo
            gradientPosition={gradientPosition}
            className={className}
            src={imageUrl}
            title={imageAlt}
            height={height}
            width={width}
          />
        </div>
        <div className="w-full lg:w-1/2">
          {solvedIssue && (
            <p className="text-sm font-medium pl-1 pr-2 py-0.5 bg-emerald-50 border border-emerald-500 w-fit text-emerald-500 mb-4 rounded-full flex items-center gap-2">
              <Check className="w-4 h-4" strokeWidth={2} />
              {/* <div className={`rounded-full bg-emerald-200`}>
                <svg
                  className={`w-4 h-4 border-2 rounded-full ${"text-emerald-600 border-emerald-600"}`}
                  fill="none"
                  strokeWidth="3"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div> */}
              {solvedIssue}
            </p>
          )}
          {headingType === "h2" && (
            <h2
              className={`mb-3 text-3xl md:text-4xl md:mb-4 font-bold leading-[1.2]  ${
                textColor || "text-text"
              }`}
            >
              {title}
            </h2>
          )}
          {headingType === "h3" && (
            <h3
              className={`mb-3 text-3xl md:text-4xl md:mb-4 font-bold leading-[1.2]  ${
                textColor || "text-text"
              }`}
            >
              {title}
            </h3>
          )}
          <p className="text-text text-xl leading-normal flex flex-col items-start gap-2">
            {description}
          </p>
          {feature && (
            <Link
              href={`/features#${feature}`}
              className="text-base font-medium mt-4 text-primary/80 hover:text-primary flex items-center gap-2"
            >
              Learn More <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
