import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Target, Shield } from "lucide-react";
import * as Icons from "lucide-react";
import { challengeDetails, goalDetails } from "@/lib/features/features";
import FeatureSection from "./FeatureSection";

const FeatureDetail = ({ feature }) => {
  const {
    title,
    detailedDescription,
    description,
    icon,
    imageUrl,
    benefits,
    keyPoints,
    releaseVersion,
    category,
    categories,
    challenges,
    goals,
    isPro,
    featureSection,
  } = feature;

  // Dynamically import the icon from lucide-react
  const IconComponent = Icons[icon] || Icons.Star;

  // Determine if the media is a video
  const isVideo = imageUrl?.endsWith(".mp4");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Feature media (video or image) */}
        <div className="w-full md:w-1/2 rounded-lg overflow-hidden shadow-md border border-border/40">
          {isVideo ? (
            <video
              src={imageUrl}
              className="w-full h-auto"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={imageUrl || "/feature-placeholder.png"}
              alt={title}
              className="w-full h-auto"
            />
          )}
        </div>

        {/* Feature details */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <IconComponent className="h-6 w-6" />
            </div>
            {category && (
              <Badge variant="outline" className="capitalize text-xs">
                {category}
              </Badge>
            )}
            {categories && categories.length > 0 && !category && (
              <div className="flex gap-1.5">
                {categories.map((cat, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="capitalize text-xs"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
            {releaseVersion && (
              <Badge variant="outline" className="text-xs bg-muted">
                v{releaseVersion}
              </Badge>
            )}
            {isPro && (
              <Badge
                variant="default"
                className="bg-purple-500 capitalize text-xs"
              >
                Pro
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">{title}</h1>

          {description && (
            <p className="text-lg text-muted-foreground mb-4">{description}</p>
          )}

          <div className="text-muted-foreground">
            {detailedDescription &&
              detailedDescription.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="mb-4">
                  {paragraph}
                </p>
              ))}
          </div>

          {/* Challenges this feature helps with */}
          {challenges && challenges.length > 0 && (
            <div className="mt-4">
              <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-red-500" />
                Helps overcome:
              </h3>
              <div className="flex flex-wrap gap-2">
                {challenges.map((challengeId) => {
                  const challenge = challengeDetails[challengeId];
                  return (
                    <div
                      key={challengeId}
                      className="flex items-center gap-1.5 text-sm bg-slate-100 px-3 py-1.5 rounded-full"
                    >
                      <span>{challenge.icon}</span>
                      <span>{challenge.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Goals this feature helps achieve */}
          {goals && goals.length > 0 && (
            <div className="mt-2">
              <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-blue-500" />
                Helps achieve:
              </h3>
              <div className="flex flex-wrap gap-2">
                {goals.map((goalId) => {
                  const goal = goalDetails[goalId];
                  return (
                    <div
                      key={goalId}
                      className="flex items-center gap-1.5 text-sm bg-blue-50 px-3 py-1.5 rounded-full"
                    >
                      <span>{goal.icon}</span>
                      <span>{goal.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render FeatureSection if available */}
      {featureSection && <FeatureSection section={featureSection} />}

      {/* Benefits and key points */}
      {benefits && keyPoints && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Benefits */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Benefits</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Key Points */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Key Points</h3>
              <ul className="space-y-3">
                {keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FeatureDetail;
