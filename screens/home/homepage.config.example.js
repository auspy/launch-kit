// Example configuration for HomePage component
export const homepageConfig = {
  hero: {
    title: "Focus is hard.",
    subtitle: "",
    description: (
      <>
        <strong>So we made it easy.</strong> Focusmo helps you block
        distractions, track deep-work hours, and stay on one task at a time.
      </>
    ),
    lessonHeader: true,
    headingClassNames: "!leading-[1.2] gap-2 text-4xl md:text-5xl",
    downloadButtonType: "hero",
    showLogo: false,
    keyPoints: [],
    // Additional props can be passed here
    props: {}
  },
  
  sections: {
    // Focus Loss Problem - disabled by default
    focusLossProblem: {
      enabled: false,
      props: {}
    },
    
    // Feature Banner - enabled by default
    featureBanner: {
      enabled: true,
      props: {}
    },
    
    // Feature List - enabled by default
    featureList: {
      enabled: true,
      props: {}
    },
    
    // Productivity Loss - disabled by default
    productivityLoss: {
      enabled: false,
      props: {}
    },
    
    // Impact Section - enabled by default
    impactSection: {
      enabled: true,
      props: {}
    },
    
    // Trusted By - disabled by default
    trustedBy: {
      enabled: false,
      props: {
        companies: [
          { name: "Company 1", logo: "/logos/company1.png" },
          { name: "Company 2", logo: "/logos/company2.png" }
        ]
      }
    },
    
    // Testimonials - enabled by default
    testimonials: {
      enabled: true,
      props: {}
    },
    
    // Single Testimonial - disabled by default
    testimonialSingle: {
      enabled: false,
      person: "franc", // Options: franc, abel, garrat, etc.
      props: {}
    },
    
    // Pricing Section - disabled by default
    pricing: {
      enabled: false,
      props: {}
    },
    
    // FAQ - disabled by default
    faq: {
      enabled: false,
      props: {
        faqs: [
          {
            question: "What is Focusmo?",
            answer: "Focusmo is a productivity app that helps you stay focused."
          }
        ]
      }
    },
    
    // CTA Section - enabled by default
    cta: {
      enabled: true,
      props: {}
    }
  },
  
  // Custom spacing between sections
  spacing: {
    afterHero: "mb-24 md:mb-48 lg:mb-64",
    afterFeatureBanner: "mb-24 md:mb-48 lg:mb-64",
    afterFeatureList: "mb-12 md:mb-24 lg:mb-32",
    afterImpact: "mb-12 md:mb-24 lg:mb-32",
    afterTestimonials: "mb-24 md:mb-48 lg:mb-64",
    betweenSections: "mb-16 md:mb-24 lg:mb-32"
  }
};

// Minimal configuration example
export const minimalHomepageConfig = {
  hero: {
    title: "Your Product Name",
    description: "Your product description",
    downloadButtonType: "hero",
    showLogo: true
  },
  sections: {
    // All sections use defaults
  }
};

// Full-featured configuration example
export const fullHomepageConfig = {
  hero: {
    title: "Revolutionary Focus Tool",
    subtitle: "For the modern professional",
    description: "Block distractions, track time, achieve more.",
    lessonHeader: false,
    headingClassNames: "text-5xl md:text-6xl font-bold",
    downloadButtonType: "hero",
    showLogo: true,
    keyPoints: [
      "Block distracting websites",
      "Track deep work hours",
      "Stay focused on one task"
    ]
  },
  sections: {
    focusLossProblem: { enabled: true },
    featureBanner: { enabled: true },
    featureList: { enabled: true },
    productivityLoss: { enabled: true },
    impactSection: { enabled: true },
    trustedBy: { enabled: true },
    testimonials: { enabled: true },
    testimonialSingle: { 
      enabled: true,
      person: "franc"
    },
    pricing: { enabled: true },
    faq: { 
      enabled: true,
      props: {
        faqs: [
          {
            question: "How does it work?",
            answer: "Simply install and start focusing."
          }
        ]
      }
    },
    cta: { enabled: true }
  }
};