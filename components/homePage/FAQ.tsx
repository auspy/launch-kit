"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import {
  trackButtonClick,
  ButtonActions,
  trackElementInteraction,
  Locations,
} from "@/lib/tracking";
import SectionHeading from "@/components/SectionHeading";

const basicFaqs = [
  {
    question: "What is Focusmo?",
    answer:
      "Focusmo is an ADHD-friendly productivity app that helps you tackle one task at a time with an always-visible timer. It combines smart Pomodoro sessions with distraction blocking to help you beat procrastination and stay focused on what matters.",
  },
  {
    question: "How does it help with ADHD?",
    answer:
      "Focusmo is specifically designed for ADHD minds with features like visual timers, customizable Pomodoro sessions, and distraction blocking(coming soon). It helps break tasks into manageable chunks and maintains your attention by eliminating digital distractions.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "You can try Focusmo completely free for 3 days with all premium features included. No credit card required. After the trial, you can continue using the free features forever, or purchase a license to unlock all premium features.",
  },
  {
    question: "Is Focusmo compatible with my Mac?",
    answer:
      "Focusmo is compatible with macOS 13 and later versions. It's optimized for both Intel and Apple Silicon Macs, ensuring smooth performance across all modern Mac devices.",
  },
  {
    question: "What happens after I purchase a license?",
    answer:
      "After purchase, you'll receive a license key via email. Simply enter this key in the app to unlock all premium features permanently. Your license includes free updates and our premium support.",
  },
  {
    question: "Do you offer a refund policy?",
    answer:
      "Yes, we offer a 7-day money-back guarantee. If you're not satisfied with Focusmo, contact our support team within 7 days of purchase for a full refund.",
  },
  {
    question: "Which OS does Focusmo support?",
    answer:
      "Focusmo is currently available for macOS Big Sur (11.0) and later versions. It's optimized for both Intel and Apple Silicon Macs, ensuring smooth performance across all modern Mac devices.",
  },
];

export default function FAQ({
  headingSize = "h2",
  faqs = basicFaqs,
}: {
  headingSize?: "h2" | "h3";
  faqs?: any[];
}) {
  const handleFaqItemClick = (question: string, isOpen: boolean) => {
    trackElementInteraction(
      "faq_item",
      isOpen ? ButtonActions.COLLAPSE : ButtonActions.EXPAND,
      {
        question: question,
        location: Locations.FAQ,
      }
    );
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="faq">
      <div className="container px-4 md:px-6">
        <SectionHeading
          title="Got Questions?"
          headingSize={headingSize}
          description="We're here to help. If you have any questions, please don't hesitate to contact us."
        />
        <div className="mx-auto max-w-[800px] mt-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border"
              >
                <AccordionTrigger
                  className="text-left text-foreground hover:text-foreground/80"
                  onClick={() => handleFaqItemClick(faq.question, false)}
                >
                  <span className="text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-zinc-200 px-4 py-2 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              onClick={() =>
                trackButtonClick("contact_support", ButtonActions.CONTACT, {
                  location: Locations.FAQ,
                })
              }
            >
              Still got questions? Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
