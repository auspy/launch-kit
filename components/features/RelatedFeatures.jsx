import React from "react";
import { getAllFeatures } from "@/lib/features/features";
import FeatureCard from "./FeatureCard";

const RelatedFeatures = ({ currentFeatureId, category, limit = 3 }) => {
  const allFeatures = getAllFeatures();

  // Filter features in the same category, excluding the current one
  const relatedFeatures = allFeatures
    .filter(
      (feature) =>
        feature.category === category && feature.id !== currentFeatureId
    )
    .slice(0, limit);

  // If we don't have enough features in the same category, add some from other categories
  if (relatedFeatures.length < limit) {
    const otherFeatures = allFeatures
      .filter(
        (feature) =>
          feature.category !== category && feature.id !== currentFeatureId
      )
      .slice(0, limit - relatedFeatures.length);

    relatedFeatures.push(...otherFeatures);
  }

  if (relatedFeatures.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedFeatures.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </div>
  );
};

export default RelatedFeatures;
