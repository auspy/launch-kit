"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DownloadModal from "@/components/modals/DownloadModal";
import ButtonGetLifetimeLicense from "@/components/buttons/ButtonGetLifetimeLicense";
import { trackButtonClick, ButtonActions, Locations } from "@/lib/tracking";

export default function PurchaseLicense({
  align = "center",
  location = Locations.CTA_SECTION,
}) {
  const router = useRouter();
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleDownload = () => {
    // Track the download action
    trackButtonClick("open_download_modal", ButtonActions.OPEN_MODAL, {
      location: location,
      source: "purchase_license",
    });

    setShowDownloadModal(true);
  };

  return (
    <div className={``}>
      {/* <ButtonMainCTA onClick={handleDownload} align={align} /> */}
      <ButtonGetLifetimeLicense location={location} />
      <DownloadModal
        open={showDownloadModal}
        onOpenChange={(isOpen) => {
          setShowDownloadModal(isOpen);

          // Track when modal is closed
          if (!isOpen) {
            trackButtonClick(
              "close_download_modal",
              ButtonActions.CLOSE_MODAL,
              {
                location: Locations.MODAL,
                source: "purchase_license",
              }
            );
          }
        }}
      />
    </div>
  );
}
