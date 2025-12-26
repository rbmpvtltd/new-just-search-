export type RevenueCatEventType =
  | "INITIAL_PURCHASE"
  | "RENEWAL"
  | "CANCELLATION"
  | "UNCANCELLATION"
  | "NON_RENEWING_PURCHASE"
  | "SUBSCRIPTION_PAUSED"
  | "EXPIRATION"
  | "BILLING_ISSUE"
  | "PRODUCT_CHANGE"
  | "TRANSFER"
  | "SUBSCRIPTION_EXTENDED";

export interface RevenueCatWebhookEvent {
  api_version: string;
  event: RevenueCatEventData;
}

export interface RevenueCatEventData {
  // Event Metadata
  type: RevenueCatEventType;
  id: string;
  app_id: string;
  event_timestamp_ms: number;

  // User Identifiers
  app_user_id: string;
  aliases: string[];
  original_app_user_id: string;

  // Product Info
  product_id: string;
  price: number;
  currency: string;
  price_in_purchased_currency: number;

  // Dates
  purchased_at_ms: number;
  grace_period_expiration_at_ms?: number | null;
  expiration_at_ms: bigint;
  auto_resume_at_ms?: number | null;

  // Transaction Details
  transaction_id: string;
  original_transaction_id: string;
  store: "PLAY_STORE" | "APP_STORE" | "STRIPE" | "PROMOTIONAL" | "AMAZON";
  environment: "PRODUCTION" | "SANDBOX";

  // Cancellation / Refund Info
  cancel_reason?:
    | "UNSUBSCRIBE"
    | "BILLING_ERROR"
    | "DEVELOPER_INITIATED"
    | "PRICE_INCREASE"
    | "CUSTOMER_SUPPORT"
    | "UNKNOWN";
  refunded_at_ms?: number | null;

  // Entitlements (What the user now has access to)
  entitlement_ids: string[] | null;
  presented_offering_id: string | null;
}
