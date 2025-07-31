export const PAYMENT_STATUS = {
  succeeded: "success",
  failed: "error",
  cancelled: "error",
  processing: "processing",
  requires_customer_action: "processing",
  requires_merchant_action: "processing",
  requires_payment_method: "processing",
  requires_confirmation: "processing",
  requires_capture: "processing",
  partially_captured: "processing",
  partially_captured_and_capturable: "processing",
};

export const mapPaymentStatus = (status) => {
  switch (status) {
    case PAYMENT_STATUS.succeeded:
      return "success";
    case PAYMENT_STATUS.failed:
      return "error";
    case PAYMENT_STATUS.cancelled:
      return "error";
    case PAYMENT_STATUS.processing:
      return "processing";
    case PAYMENT_STATUS.requires_customer_action:
      return "processing";
    case PAYMENT_STATUS.requires_merchant_action:
      return "processing";
    case PAYMENT_STATUS.requires_payment_method:
      return "processing";
    case PAYMENT_STATUS.requires_confirmation:
      return "processing";
    case PAYMENT_STATUS.requires_capture:
      return "processing";
    case PAYMENT_STATUS.partially_captured:
      return "processing";
    case PAYMENT_STATUS.partially_captured_and_capturable:
      return "processing";
    default:
      return "unknown";
  }
};
