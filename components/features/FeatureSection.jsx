import React from "react";
import { challengeDetails } from "@/lib/features/features";
import { cn } from "@/lib/utils";

// Component to render different types of sections
const FeatureSection = ({ section }) => {
  const { title, description, content = [] } = section;

  return (
    <div className="my-16">
      {/* Section header */}
      {title && (
        <div className="mb-6">
          <h2 className=" font-bold mb-4">{title}</h2>
          {description && <p className="text-lg ">{description}</p>}
        </div>
      )}

      {/* Content sections */}
      <div className="space-y-24 mt-16">
        {content.map((item, index) => (
          <ContentSection key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

const ContentSection = ({ item }) => {
  const { type } = item;

  switch (type) {
    case "bulletPoints":
      return <BulletPointsSection {...item} />;
    case "imageSteps":
      return <ImageStepsSection {...item} />;
    case "comparison":
      return <ComparisonSection {...item} />;
    case "contentWithImage":
      return <ContentWithImageSection {...item} />;
    case "keyPoints":
      return <KeyPointsSection {...item} />;
    case "helpsFight":
      return <HelpsFightSection {...item} />;
    case "horizontalScrollImages":
      return <HorizontalScrollImagesSection {...item} />;
    default:
      return <p></p>;
  }
};

// Simple bullet points section
const BulletPointsSection = ({ title, points, columns = 3 }) => {
  return (
    <div>
      {title && <h3 className="text-xl font-semibold mb-6">{title}</h3>}
      <div
        className={`grid grid-cols-1 md:grid-cols-${columns} gap-x-16 gap-y-5`}
      >
        {points.map((point, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-lg text-zinc-600">•</span>
            <span className="text-zinc-600">{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Image steps section (3 columns)
const ImageStepsSection = ({ steps, maxHeight = 600 }) => {
  const totalSteps = steps?.length;
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-${totalSteps} gap-8`}
      style={{
        maxHeight: "min-content",
      }}
    >
      {steps.map((step, index) => {
        const isVideo = step.image?.endsWith(".mp4");

        return (
          <div key={index} className="flex flex-col">
            {step.title && (
              <h3 className="text-lg font-semibold mb-4">{step.title}</h3>
            )}
            {step.descriptionBefore && step.description && (
              <p className="mb-4">{step.description}</p>
            )}
            <div
              className={cn(
                " w-fit overflow-hidden rounded-lg text-start   mb-4",
                isVideo ? "aspect-video" : "",
                step.showShadow ? "shadow-lg" : ""
              )}
              style={{
                maxHeight: maxHeight,
              }}
            >
              {isVideo ? (
                <video
                  src={step.image}
                  className={cn("w-full  object-contain")}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={step.image || "/feature-placeholder.png"}
                  alt={step.title}
                  className={cn("w-full h-full object-contain")}
                />
              )}
            </div>
            {!step.descriptionBefore && step.description && (
              <p className="">{step.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Side-by-side comparison
const ComparisonSection = ({ title, items }) => {
  return (
    <div>
      {title && <h3 className="text-2xl font-semibold mb-6">{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {items.map((item, index) => {
          const isVideo = item.image?.endsWith(".mp4");

          return (
            <div key={index} className="flex flex-col">
              <h4 className="text-xl font-medium mb-4">{item.title}</h4>
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-50 mb-4">
                {isVideo ? (
                  <video
                    src={item.image}
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={item.image || "/feature-placeholder.png"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {item.points && (
                <div className="space-y-2">
                  {item.points.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-lg">•</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Content with image section
const ContentWithImageSection = ({
  title,
  description,
  image,
  imagePosition = "right",
  content,
  shadow = true,
}) => {
  const imageArray = Array.isArray(image)
    ? image
    : typeof image === "string"
    ? [image]
    : [];

  return (
    <div>
      {title && <h3 className="text-2xl font-semibold">{title}</h3>}
      <div
        className={`grid grid-cols-1 md:grid-cols-1 gap-6 items-center ${
          imagePosition === "left" ? "flex-row-reverse" : ""
        }`}
      >
        <div className="space-y-2">
          {description && <p className=" mt-3">{description}</p>}
          {content && <div>{content}</div>}
        </div>
        <div className="flex flex-col md:flex-row items-start gap-4 w-full">
          {image && imageArray.length == 0
            ? image
            : imageArray.map((img, index) => {
                const isVideo = img.endsWith(".mp4");
                return (
                  <div
                    key={index}
                    className={cn(
                      " w-full md:w-fit  md:max-w-[50%] overflow-hidden rounded-lg ",

                      shadow ? "shadow-xl" : ""
                    )}
                  >
                    {isVideo ? (
                      <video
                        src={img}
                        className="w-full md:w-fit h-auto object-contain"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={img || "/feature-placeholder.png"}
                        alt={title}
                        className="w-full md:w-fit h-auto object-contain"
                      />
                    )}
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

// Key points section
const KeyPointsSection = ({ title, points }) => {
  return (
    <div>
      {title && <h3 className="text-2xl font-semibold mb-4">{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {points.map((point, index) => (
          <div
            key={index}
            className={cn(
              "flex  gap-3",
              point.description ? "items-start" : "items-center"
            )}
          >
            <div className="bg-primary/10 text-primary p-1.5 rounded-md flex-shrink-0 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{point.title}</h4>
              {point.description && (
                <p className="text-sm text-muted-foreground">
                  {point.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helps fight section
const HelpsFightSection = ({ title, challenges }) => {
  if (!challenges || challenges.length === 0) return null;

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">
        {title || "Helps you fight:"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((challengeId) => {
          const challenge = challengeDetails[challengeId];
          return (
            <div
              key={challengeId}
              className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <span className="text-2xl">{challenge.icon}</span>
              <div>
                <p className="font-medium">{challenge.title}</p>
                <p className="text-sm text-muted-foreground">
                  {challenge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Horizontal scroll images section
const HorizontalScrollImagesSection = ({
  title,
  description,
  images,
  showShadow = true,
}) => {
  const scrollContainerRef = React.useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full">
      {title && <h3 className="text-2xl font-semibold mb-4">{title}</h3>}
      {description && <p className="mb-6">{description}</p>}

      <div className="relative w-full">
        {/* Left arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 md:-left-10 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
          aria-label="Scroll left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className=" max-w-screen mx-2 md:mx-0 md:max-w-[1200px] pr-10 flex gap-4 overflow-x-scroll pb-4 hide-scrollbar"
        >
          {images.map((img, index) => {
            const isVideo = img.src.endsWith?.(".mp4");
            return (
              <div
                key={index}
                className={cn(
                  "flex-shrink-0 rounded-2xl ",
                  isVideo ? "aspect-video" : "",
                  showShadow ? "shadow-lg" : ""
                )}
                style={{
                  maxWidth: "85%",
                  height: "fit-content",
                }}
              >
                {isVideo ? (
                  <video
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={img.src || "/feature-placeholder.png"}
                    alt={img.alt}
                    className="max-w-[500px] w-full h-auto object-contain"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Right gradient overlay */}
        <div className="absolute -right-3 top-0 h-full w-28 bg-gradient-to-l from-white to-transparent z-10"></div>

        {/* Right arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 md:-right-10 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
          aria-label="Scroll right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FeatureSection;
