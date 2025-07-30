import PricingCards3 from "@/components/pricing/PricingCards3";

export default function PricingSection() {
  return (
    <div id="pricing" className="bg-gray-50 w-full">
      <div className="container contain max-w-6xl px-4 py-24">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-primary drop-shadow-sm relative mb-3 sm:mb-4 ">
            Stay Focused, Get More Done
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-medium px-4 sm:px-0">
            Save <span className="text-primary font-bold">up to 40%</span>{" "}
            during beta • Limited spots available!
          </p>
        </div>

        <PricingCards3 className="mb-8" />
      </div>
    </div>
  );
}
