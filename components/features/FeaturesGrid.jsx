"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FeatureSection from "./FeatureSection";
import PageHeader from "@/components/PageHeader";
import FeatureSectionNav from "./FeatureSectionNav";
import { featureSections } from "@/lib/features/feature-sections";
import AlertMessage from "../alerts/AlertMessage";
import CreatorTipLink from "../alerts/CreatorTipAlert";

const FeaturesGrid = () => {
  const router = useRouter();

  // Handle section navigation
  const handleSectionChange = (sectionId) => {
    if (sectionId) {
      // Smooth scroll to feature section
      const element = document.getElementById(`${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      // Update URL with the feature ID
      router.push(`/features#${sectionId}`, { scroll: false });
    }
  };

  return (
    <div className="wrapper px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center">
          <PageHeader
            title="All Features"
            description="Explore all the tools you need to stay focused and get more done."
            descriptionClassName="max-w-3xl"
            containerClassName="border-none pb-4 w-full"
          />
          <div className="mb-6 -mt-2">
            <CreatorTipLink
              tipContent="Go through the list slowly when you have time, you will surely find interesting insights about each feature. If you have any questions or feedback, feel free to reach out to me on discord or email."
              tipTitle="Creator's Request"
            />
          </div>

          {/* Feature section navigation */}
          <div className="w-full bg-white border-b mb-10  z-10 py-4 pb-16">
            <FeatureSectionNav
              sections={featureSections}
              onSectionChange={handleSectionChange}
              className="max-w-3xl mx-auto "
            />
          </div>

          {/* Featured sections at the top */}
          <div className=" space-y-32">
            {Object.entries(featureSections).map(([key, feature]) => (
              <div key={key} id={`${key}`} className="relative scroll-mt-24">
                <FeatureSection section={feature} />

                {/* {feature.hasWebpage && (
                  <div className="mt-8 text-left">
                    <Link
                      href={`/features/${key}`}
                      className="text-primary text-base font-medium hover:text-primary hover:underline"
                    >
                      Learn more about {feature.title} →
                    </Link>
                  </div>
                )} */}
                <hr className="mt-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesGrid;
