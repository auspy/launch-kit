import SiteFooter from "@/components/SiteFooter";
import Header from "@/components/Header";
import FeaturesGrid from "@/components/features/FeaturesGrid";
import CTASection from "@/components/CtaSection";

export default function FeaturesListPage({ 
  features = [], 
  config = {} 
}) {
  const {
    showHeader = true,
    showFooter = true,
    showCTA = true,
    layout = {
      container: "pb-12 w-full flex flex-col items-center",
      background: "min-h-screen bg-white"
    },
    metadata = {
      title: "Features",
      description: "Explore all the powerful features that help you stay focused and productive"
    },
    ctaProps = {},
    customComponents = {}
  } = config;

  return (
    <div className={layout.background}>
      {showHeader && <Header />}

      {customComponents.beforeMain}

      <main className={layout.container}>
        <FeaturesGrid features={features} />
      </main>

      {customComponents.afterMain}

      {showCTA && <CTASection {...ctaProps} />}
      {showFooter && <SiteFooter />}
    </div>
  );
}