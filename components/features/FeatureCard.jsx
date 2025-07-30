import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import { challengeDetails } from "@/lib/features/features";

// Function to check if a custom landing page exists for a feature
const hasCustomLandingPage = (feature) => {
  return feature.landingPage !== undefined;
};

const FeatureCard = ({ feature }) => {
  const {
    id,
    title,
    shortDescription,
    categories,
    icon,
    imageUrl,
    challenges,
  } = feature;

  // Dynamically import the icon from lucide-react
  const IconComponent = Icons[icon] || Icons.Star;

  // Determine if the media is a video
  const isVideo = imageUrl?.endsWith(".mp4");

  // Determine the link URL - use custom landing page if available, otherwise default detail page
  const featureUrl = hasCustomLandingPage(feature)
    ? `/features/${id}`
    : `/features/${id}`;

  return (
    <Link href={featureUrl} className="h-full hover:no-underline">
      <Card className="h-full flex flex-col hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/20 group overflow-hidden">
        <div className="aspect-video w-full overflow-hidden bg-slate-50 relative">
          {isVideo ? (
            <video
              src={imageUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={imageUrl || "/feature-placeholder.png"}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Display additional categories */}
          {categories && categories.length > 0 && (
            <div className="absolute top-3 right-3 flex gap-1.5">
              {categories.map((category, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm capitalize text-xs font-medium"
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <CardContent className="p-6 pt-5 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <IconComponent className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {shortDescription}
          </p>

          {challenges && challenges.length > 0 && (
            <div className="mt-auto">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Helps with:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {challenges.slice(0, 3).map((challengeId) => {
                  const challenge = challengeDetails[challengeId];
                  return (
                    <div
                      key={challengeId}
                      className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-full"
                      title={challenge.description}
                    >
                      <span>{challenge.icon}</span>
                      <span className="">{challenge.title}</span>
                    </div>
                  );
                })}
                {challenges.length > 3 && (
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                    +{challenges.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-6 pb-4 pt-0 mt-auto">
          <div className="text-xs font-medium text-primary flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {hasCustomLandingPage(feature) ? "View Feature" : "View Details"}
            <ChevronRight className="h-3 w-3" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default FeatureCard;
