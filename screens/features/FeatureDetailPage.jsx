import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import FeatureDetail from "@/components/features/FeatureDetail";
import RelatedFeatures from "@/components/features/RelatedFeatures";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureLandingTemplate from "@/components/features/FeatureLandingTemplate";
import FeatureContent from "@/components/features/FeatureContent";
import FeatureComparison from "@/components/features/FeatureComparison";
import FeatureIntegrations from "@/components/features/FeatureIntegrations";
import FAQ from "@/components/homePage/FAQ";
import TestimonialSection from "@/components/testimonials/TestimonialSection";
import Hero from "@/components/homePage/Hero";
import TestimonialSingle from "@/components/testimonials/TestimonialSingle";

export default function FeatureDetailPage({ 
  feature, 
  config = {} 
}) {
  // If feature not found, return 404
  if (!feature) {
    notFound();
  }

  const {
    showHeader = true,
    showFooter = true,
    showBackButton = true,
    backButtonText = "Back to Features",
    backButtonHref = "/features",
    showRelatedFeatures = true,
    layout = {
      container: "wrapper py-10",
      background: "bg-gradient-to-b from-primary/5 to-background"
    },
    heroOverrides = {},
    customComponents = {}
  } = config;

  // If feature has landing page data, render enhanced landing page
  if (feature.landingPage) {
    const {
      heroData,
      contentSections,
      integrationSection,
      testimonials,
      faqQuestions,
      comparisonData,
    } = feature.landingPage;

    // Prepare comparison component if data exists
    let comparisonComponent = null;
    if (comparisonData) {
      comparisonComponent = (
        <FeatureComparison
          title="Why Our Solution Stands Out"
          subtitle={`See how ${config.productName || "our"} ${feature.title} compares to alternatives`}
          features={comparisonData.features}
          competitors={comparisonData.competitors}
        />
      );
    }

    return (
      <FeatureLandingTemplate
        feature={feature}
        heroSection={
          <Hero
            {...heroData}
            {...heroOverrides}
            descriptionClassNames="md:text-xl"
            headingClassNames="text-5xl max-w-2xl leading-[1.15]"
            primaryButton={null}
            breadcrumb={[
              { title: backButtonText.replace("Back to ", ""), href: backButtonHref },
              { title: feature.title, active: true },
            ]}
          />
        }
        featureShowcase={
          <>
            {customComponents.beforeContent}
            <div className="mt-24 lg:mt-32" />
            <FeatureContent sections={contentSections} />
            {customComponents.afterContent}
          </>
        }
        featureIntegrations={
          <>
            {integrationSection && <TestimonialSingle />}
            <FeatureIntegrations section={integrationSection} />
          </>
        }
        comparisonComponent={comparisonComponent}
        testimonials={
          testimonials && testimonials.length > 0 ? (
            <TestimonialSection testimonials={testimonials} />
          ) : null
        }
        faq={
          faqQuestions && faqQuestions.length > 0 ? (
            <FAQ faqs={faqQuestions} />
          ) : null
        }
      />
    );
  }

  // If no landing page data, render standard feature detail page
  return (
    <div className={layout.background}>
      {showHeader && <Header />}
      <main className={layout.container}>
        {showBackButton && (
          <div className="mb-8">
            <Button variant="ghost" asChild className="group">
              <Link href={backButtonHref}>
                <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                {backButtonText}
              </Link>
            </Button>
          </div>
        )}

        {customComponents.beforeDetail}
        
        <FeatureDetail feature={feature} />
        
        {customComponents.afterDetail}

        {showRelatedFeatures && (
          <Suspense fallback={<div>Loading related features...</div>}>
            <RelatedFeatures
              currentFeatureId={feature.id}
              category={
                feature.category || (feature.categories && feature.categories[0])
              }
            />
          </Suspense>
        )}
      </main>
      {showFooter && <SiteFooter />}
    </div>
  );
}