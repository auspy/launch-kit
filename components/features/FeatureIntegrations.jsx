import React from "react";
import FeatureListItem from "@/components/features/FeatureListItem";
import SecondaryButton from "@/components/features/SecondaryButton";
import SectionHeading from "@/components/SectionHeading";
import { ArrowRight } from "lucide-react";

/**
 * Component to display feature integrations
 * @param {Object} props
 * @param {Object} props.section - The main section with title, description, and badge
 * @param {Array} props.additionalFeatures - Array of additional features to display
 */
const FeatureIntegrations = ({ section }) => {
  if (
    !section ||
    !section.additionalFeatures ||
    !section.additionalFeatures.length
  )
    return null;

  const { title, description, badge, media, additionalFeatures } = section;

  return (
    <div className="wrapper flex flex-col gap-y-6 md:gap-y-16 bg-white  pt-12 pb-32">
      {/* Main section */}
      <SectionHeading
        title={title}
        description={description}
        badge={badge}
        headingSize="h2"
      />

      {/* Additional features */}
      <div className="flex flex-col gap-y-16 md:gap-y-32">
        {additionalFeatures.map((feature, index) => (
          <FeatureListItem
            key={index}
            title={feature.title}
            description={feature.description}
            imageUrl={feature.media?.src}
            imageAlt={feature.media?.alt || feature.title}
            isImageLeft={index % 2 === 0} // Alternate left/right
            className="object-center"
            textColor="text-zinc-800"
            feature={feature.feature}
            solvedIssue={feature.badge}
            headingType="h3"
          />
        ))}
        <SecondaryButton text={<>Check all 15+ features</>} href="/features" />
      </div>
    </div>
  );
};

export default FeatureIntegrations;
