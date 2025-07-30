import * as React from "react";
import SiteFooter from "@/components/SiteFooter";
import FAQ from "@/components/homePage/FAQ";
import Header from "@/components/Header";
import PricingCards3 from "@/components/pricing/PricingCards3";
import PricingPageWrapper from "@/components/pricing/PricingPageWrapper";
import { redirect } from "next/navigation";
import { getCookie } from "cookies-next";

export default function PricingPage({ siteConfig, faqItems, localePricing }) {
  // Support for locale-specific pricing (e.g., India pricing)
  if (localePricing?.enabled) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("User timezone:", timeZone);
    
    if (localePricing.allowedTimezones.includes(timeZone)) {
      const preferStandardPricing = getCookie('preferStandardPricing');
      if (!preferStandardPricing) {
        return redirect(localePricing.redirectPath);
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="bg-white">
        <div className="container contain max-w-6xl px-4 py-12 md:py-16">
          <PricingCards3 
            className="" 
            pricing={siteConfig.payment.pricing}
            currency={siteConfig.payment.currency}
          />
          
          <div className="mt-8">
            <FAQ faqs={faqItems} headingSize="h3" />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}