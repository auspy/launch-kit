import ServerHeader from "@/components/ServerHeader";
import Hero from "@/components/homePage/Hero";
import FeatureList from "@/components/features/FeatureList";
import TestimonialSection from "@/components/testimonials/TestimonialSection";
import CTASection from "@/components/CtaSection";
import SiteFooter from "@/components/SiteFooter";
import FeatureBanner from "@/components/features/FeatureBanner";
import FocusLossProblemSection from "@/components/homePage/FocusLossProblemSection";
import ImpactSection from "@/components/homePage/ImpactSection";
import TrustedBy from "@/components/homePage/TrustedBy";
import FAQ from "@/components/homePage/FAQ";
import PricingSection from "@/components/PricingSection";
import ProductivityLoss from "@/components/ProductivityLoss";
import TestimonialSingle from "@/components/testimonials/TestimonialSingle";

export default function HomePage({ config }) {
  const {
    hero,
    sections = {},
    spacing = {},
    siteConfig
  } = config;

  // Default spacing values
  const defaultSpacing = {
    afterHero: "mb-24 md:mb-48 lg:mb-64",
    afterFeatureBanner: "mb-24 md:mb-48 lg:mb-64",
    afterFeatureList: "mb-12 md:mb-24 lg:mb-32",
    afterImpact: "mb-12 md:mb-24 lg:mb-32",
    afterTestimonials: "mb-24 md:mb-48 lg:mb-64",
    betweenSections: "mb-16 md:mb-24 lg:mb-32"
  };

  const finalSpacing = { ...defaultSpacing, ...spacing };

  return (
    <>
      <ServerHeader />
      
      {/* Hero Section */}
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        lessonHeader={hero.lessonHeader}
        headingClassNames={hero.headingClassNames}
        downloadButtonType={hero.downloadButtonType}
        showLogo={hero.showLogo}
        keyPoints={hero.keyPoints}
        {...hero.props}
      />

      {/* Optional: Focus Loss Problem Section */}
      {sections.focusLossProblem?.enabled && (
        <>
          <FocusLossProblemSection {...sections.focusLossProblem.props} />
          <div className={finalSpacing.betweenSections} />
        </>
      )}

      <div className={finalSpacing.afterHero} />

      {/* Feature Banner */}
      {sections.featureBanner?.enabled !== false && (
        <>
          <FeatureBanner {...sections.featureBanner?.props} />
          <div className={finalSpacing.afterFeatureBanner} />
        </>
      )}

      {/* Feature List */}
      {sections.featureList?.enabled !== false && (
        <>
          <FeatureList {...sections.featureList?.props} />
          <div className={finalSpacing.afterFeatureList} />
        </>
      )}

      {/* Optional: Productivity Loss Section */}
      {sections.productivityLoss?.enabled && (
        <>
          <ProductivityLoss {...sections.productivityLoss.props} />
          <div className={finalSpacing.betweenSections} />
        </>
      )}

      {/* Impact Section */}
      {sections.impactSection?.enabled !== false && (
        <>
          <ImpactSection {...sections.impactSection?.props} />
          <div className={finalSpacing.afterImpact} />
        </>
      )}

      {/* Optional: Trusted By Section */}
      {sections.trustedBy?.enabled && (
        <>
          <TrustedBy {...sections.trustedBy.props} />
          <div className={finalSpacing.betweenSections} />
        </>
      )}

      {/* Testimonials */}
      {sections.testimonials?.enabled !== false && (
        <>
          <TestimonialSection {...sections.testimonials?.props} />
          {sections.testimonialSingle?.enabled && (
            <>
              <div className={finalSpacing.betweenSections} />
              <TestimonialSingle person={sections.testimonialSingle.person} {...sections.testimonialSingle.props} />
            </>
          )}
          <div className={finalSpacing.afterTestimonials} />
        </>
      )}

      {/* Optional: Pricing Section */}
      {sections.pricing?.enabled && (
        <>
          <PricingSection {...sections.pricing.props} />
          <div className={finalSpacing.betweenSections} />
        </>
      )}

      {/* Optional: FAQ Section */}
      {sections.faq?.enabled && (
        <>
          <FAQ {...sections.faq.props} />
          <div className={finalSpacing.betweenSections} />
        </>
      )}

      {/* CTA Section */}
      {sections.cta?.enabled !== false && (
        <CTASection {...sections.cta?.props} />
      )}

      <SiteFooter />
    </>
  );
}