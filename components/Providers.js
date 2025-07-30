import { Toaster } from "./ui/toaster";
import { PayDialogProvider } from "@/contexts/PayDialogContext";
import { DownloadProvider } from "./modals/DownloadModal";
import { PostHogProvider } from "./analytics/PostHogProvider";

const Providers = ({ children, bootstrapFlags = {} }) => {
  return (
    <PostHogProvider bootstrapFlags={bootstrapFlags}>
      <PayDialogProvider>
        <DownloadProvider>{children}</DownloadProvider>
        <Toaster />
        {/* <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        /> */}
      </PayDialogProvider>
    </PostHogProvider>
  );
};

export default Providers;
