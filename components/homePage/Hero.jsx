import React from "react";
import TopPoints from "@/components/TopPoints";
import TestimonialHero from "@/components/testimonials/TestimonialHero";
import TestimonialSingle from "@/components/testimonials/TestimonialSingle";
import LessonHeader from "@/components/homePage/LessonHeader";
import ButtonMainCTA from "@/components/buttons/ButtonMainCTA";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as Icons from "lucide-react";
import Logo from "../Logo";
import HeroVideoOverlay from "./HeroVideoOverlay";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Locations } from "@/lib/tracking";

/**
 * Hero section for feature landing pages
 * @param {Object} props
 * @param {string} props.title - Feature title
 * @param {string} props.subtitle - Feature subtitle
 * @param {string} props.description - Feature description
 * @param {string} props.videoSrc - URL to feature demo video
 * @param {Array<string>} props.keyPoints - Key points to highlight
 * @param {Object} props.primaryButton - Primary CTA button config
 * @param {Object} props.secondaryButton - Secondary CTA button config
 * @param {string} props.badge - Optional badge text (e.g. "Pro", "New", "Coming Soon")
 * @param {string} props.badgeVariant - Badge variant (default, outline, etc.)
 * @param {string} props.lessonHeader - Optional lesson header
 * @param {string} props.testimonialPerson - Optional testimonial
 * @param {string} props.downloadButtonType - Optional download button type
 * @param {boolean} props.showLogo - Optional show logo
 * @param {string} props.descriptionClassNames - Optional description class names
 * @param {string} props.headingClassNames - Optional heading class names
 * @param {string} props.align - Optional align (start, center, end)
 * @param {string|Array<{title: string, href: string, active?: boolean}>} props.breadcrumb - Optional breadcrumb navigation
 *   - If string: Will be displayed as "Home > Features > [breadcrumb]"
 *   - If array: Each item should have {title, href, active} where active items are displayed as the current page
 *   - Example: [{title: "Features", href: "/features"}, {title: "My Feature", active: true}]
 */
export default function Hero({
  title = "",
  subtitle = "",
  description = "",
  videoSrc = "/hero_2.mp4",
  keyPoints = [
    "Website & App Blocking",
    "Auto Time Tracking",
    "Pomodoro Timer",
  ],
  primaryButton,
  secondaryButton = null,
  badge = null,
  badgeVariant = "default",
  testimonialImages = ["ishan.png", "abel.png", "franc.png", "will.png"],
  lessonHeader = false,
  testimonialPerson = "ishan",
  downloadButtonType = "big",
  showLogo = true,
  descriptionClassNames = "",
  headingClassNames = "",
  align = "start",
  breadcrumb = null,
}) {
  // Dynamically get the icon component if specified
  const PrimaryIcon = primaryButton?.icon ? Icons[primaryButton.icon] : null;
  const SecondaryIcon = secondaryButton?.icon
    ? Icons[secondaryButton.icon]
    : null;
  return (
    <div
      className={cn(
        "flex wrapper bg-blue flex-col gap-6 items-center pt-[7.5%] justify-between",
        align === "center" ? "items-center" : "items-start",
        breadcrumb && "pt-4 md:pt-8"
      )}
    >
      {breadcrumb && (
        <div className="w-full max-w-6xl ">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-sm">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              {Array.isArray(breadcrumb) ? (
                // If breadcrumb is an array, map through items
                breadcrumb.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {item.active ? (
                        <BreadcrumbPage className="text-primary/80 text-sm font-medium">
                          {item.title}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href} className="text-sm">
                          {item.title}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))
              ) : (
                // Legacy support for string breadcrumb
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/features" className="text-sm">
                      Features
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-primary/80 text-sm font-medium">
                      {breadcrumb}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}
      <div
        className={cn(
          "flex gap-6 items-center",
          align === "center"
            ? "max-w-3xl"
            : "w-full justify-between flex-col lg:flex-row"
        )}
      >
        <div
          className={cn(
            "flex flex-col lg:w-[54vw]",
            align === "center"
              ? "items-center"
              : "items-start max-w-xl lg:w-full"
          )}
        >
          {/* Badge if available */}
          {badge && (
            <Badge variant={badgeVariant} className="mb-4">
              {badge}
            </Badge>
          )}
          {lessonHeader && <LessonHeader />}
          {/* {showLogo && (
            <div className="mb-3">
              <Logo size={90} onlyLogo={true} />
            </div>
          )} */}
          <h1
            className={cn(
              "mt-6 leading-[1.2] tracking-tight",
              align === "center" ? "text-center" : "text-left text-6xl",
              headingClassNames
            )}
          >
            {title}
            <br />
            {subtitle}
          </h1>

          <p
            className={cn(
              `text-center  gap-1 w-full  md:max-w-[85%]`,
              description && " mt-4",
              "text-base md:text-2xl md:text-[22px]",
              align === "center" ? "" : "text-left leading-normal",
              descriptionClassNames
            )}
          >
            {description}
          </p>

          <div className="mt-6 " />
          <TopPoints labels={keyPoints} align={align} />
          <div className="mt-6 " />
          {primaryButton ? (
            <div className="flex gap-4">
              {primaryButton.text.toLowerCase().includes("download") ? (
                <ButtonMainCTA
                  type={downloadButtonType}
                  location={Locations.HERO}
                />
              ) : (
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90 focus:bg-primary/90"
                >
                  <Link
                    href={primaryButton.href}
                    className="hover:no-underline"
                  >
                    {primaryButton.text}
                    {PrimaryIcon && <PrimaryIcon className="ml-2 h-4 w-4" />}
                  </Link>
                </Button>
              )}
              {secondaryButton && (
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="border-primary text-primary hover:text-primary hover:bg-primary/10 focus:bg-primary/10"
                >
                  <Link className="hover:no-underline" {...secondaryButton}>
                    {secondaryButton.text}
                    {SecondaryIcon && (
                      <SecondaryIcon className="ml-2 h-4 w-4" />
                    )}
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <ButtonMainCTA
              align={align}
              type={downloadButtonType}
              location={Locations.HERO}
            />
          )}
          <div className="mt-2" />
          {align === "center" ? (
            <TestimonialHero images={testimonialImages} />
          ) : (
            <div className="mt-10">
              <TestimonialSingle
                person={testimonialPerson}
                showStars={false}
                size="small"
              />
            </div>
          )}
        </div>
        <div className="mt-4 md:mt-0 w-full">
          <HeroVideo videoSrc={videoSrc} />
        </div>
      </div>
      {align == "center" && (
        <>
          {" "}
          <HeroVideo videoSrc={videoSrc} />{" "}
          <TestimonialSingle
            person={testimonialPerson}
            showStars={true}
            size="large"
          />
        </>
      )}
    </div>
  );
}

const HeroVideo = ({ videoSrc = "/hero_2.mp4" }) => {
  return (
    <div className="relative  w-full h-fit bg-gradient-to-b from-zinc-50 to-zinc-100 overflow-hidden rounded-3xl shadow-2xl ">
      <video
        height={1080}
        width={1920}
        title={"Hero Video"}
        className={"relative object-cover w-full h-[240px] md:h-[400px]"}
        src={videoSrc}
        loop
        autoPlay={true}
        muted
        playsInline
        preload="auto"
      />
      <HeroVideoOverlay />
    </div>
  );
};
