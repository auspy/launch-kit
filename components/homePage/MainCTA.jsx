import { Suspense } from "react";
import EmailWaitlist from "./EmailWaitlist";
import PurchaseLicense from "./PurchaseLicense";

// Define CTA_TYPES before exporting
export const CTA_TYPES = {
  EMAIL_WAITLIST: "EMAIL_WAITLIST",
  PURCHASE_LICENSE: "PURCHASE_LICENSE",
};

// Default export for the component
export default function MainCTA({
  type = CTA_TYPES.EMAIL_WAITLIST,
  align = "center",
  containerAlign = "center",
}) {
  const renderCTA = () => {
    switch (type) {
      case CTA_TYPES.EMAIL_WAITLIST:
        return <EmailWaitlist />;
      case CTA_TYPES.PURCHASE_LICENSE:
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <PurchaseLicense align={align} />
          </Suspense>
        );
      default:
        return <EmailWaitlist />;
    }
  };

  return (
    <div className={`w-full flex flex-col items-${containerAlign}`}>
      {renderCTA()}
    </div>
  );
}
