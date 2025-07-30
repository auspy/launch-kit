import React from "react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as Icons from "lucide-react";
import CTASection from "@/components/CtaSection";

/**
 * A template for feature landing pages
 * @param {Object} props
 * @param {Object} props.feature - The feature object from the features.js data
 * @param {React.ReactNode} props.heroSection - Custom hero section for the feature
 * @param {React.ReactNode} props.featureShowcase - Feature use cases or detailed sections
 * @param {React.ReactNode} props.featureIntegrations - Feature integrations
 * @param {React.ReactNode} props.comparisonComponent - Feature comparison component
 * @param {React.ReactNode} props.testimonials - Feature-specific testimonials
 * @param {React.ReactNode} props.faq - Feature-specific FAQ
 * @param {React.ReactNode} props.customCta - Optional custom CTA (if not provided, default CTASection is used)
 */
const FeatureLandingTemplate = ({
  feature,
  heroSection,
  featureShowcase,
  featureIntegrations,
  comparisonComponent,
  testimonials,
  faq,
  customCta,
}) => {
  return (
    <div className="min-h-screen ">
      <Header />
      <main className="flex flex-col items-center w-full">
        <div className="pb-12 flex flex-col    items-center w-full">
          {/* Hero Section */}
          {heroSection}

          {/* Feature Showcase/Use Cases */}
          {featureShowcase}
        </div>
        <div className="flex flex-col items-center w-full">
          {/* Feature Integrations */}
          {featureIntegrations}

          {/* Comparison Component */}
          {comparisonComponent}

          {/* Testimonials */}
          {testimonials}

          {/* FAQ */}
          {faq}
          {/* Call to Action */}
          {customCta || <CTASection />}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default FeatureLandingTemplate;
