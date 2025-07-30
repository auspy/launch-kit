import React from "react";
import FeatureListItem from "@/components/features/FeatureListItem";
/**
 * Component to display feature content using FeatureListItem
 * @param {Object} props
 * @param {Array} props.sections - Array of feature sections to display
 */
const FeatureContent = ({ sections = [] }) => {
  if (!sections.length) return null;

  return (
    <div className="wrapper flex flex-col gap-y-16 md:gap-y-40">
      {sections.map((section, index) => (
        <FeatureListItem
          {...section}
          key={index}
          title={section.title}
          description={section.description}
          imageUrl={section.media?.src}
          imageAlt={section.media?.alt || section.title}
          isImageLeft={index % 2 === 0} // Alternate left/right like main page
          solvedIssue={section.badge}
          className={section.className || "object-center"}
          textColor={section.textColor || "text-zinc-800"}
          feature={section.feature}
        />
      ))}
    </div>
  );
};

export default FeatureContent;
