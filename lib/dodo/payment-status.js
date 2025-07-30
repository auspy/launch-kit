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
