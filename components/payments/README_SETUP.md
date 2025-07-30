# Dodo Payments Overlay Setup

## Overview

The Dodo Payments overlay integration replaces the previous API route-based checkout with a seamless in-page overlay experience. This provides better UX and real-time event handling.

## Environment Variables Required

You need to add the following environment variables to your `.env.local` file in the `focusmode_web` directory. These variables are exposed to the client-side through `next.config.js`:

```bash
# Dodo Payments Product IDs - Standard Pricing
ONE_YEAR_1_DEVICES_PRODUCT_ID=your_product_id_here
ONE_YEAR_2_DEVICES_PRODUCT_ID=your_product_id_here
ONE_YEAR_5_DEVICES_PRODUCT_ID=your_product_id_here
ONE_YEAR_10_DEVICES_PRODUCT_ID=your_product_id_here

LIFETIME_1_DEVICES_PRODUCT_ID=your_product_id_here
LIFETIME_2_DEVICES_PRODUCT_ID=your_product_id_here
LIFETIME_5_DEVICES_PRODUCT_ID=your_product_id_here
LIFETIME_10_DEVICES_PRODUCT_ID=your_product_id_here

BELIEVER_5_DEVICES_PRODUCT_ID=your_product_id_here
TEAM_PRODUCT_ID=your_product_id_here

# Dodo Payments Product IDs - India Pricing (PPP)
ONE_YEAR_1_DEVICES_IN_PRODUCT_ID=your_product_id_here
ONE_YEAR_2_DEVICES_IN_PRODUCT_ID=your_product_id_here
ONE_YEAR_5_DEVICES_IN_PRODUCT_ID=your_product_id_here
ONE_YEAR_10_DEVICES_IN_PRODUCT_ID=your_product_id_here

LIFETIME_1_DEVICES_IN_PRODUCT_ID=your_product_id_here
LIFETIME_2_DEVICES_IN_PRODUCT_ID=your_product_id_here
LIFETIME_5_DEVICES_IN_PRODUCT_ID=your_product_id_here
LIFETIME_10_DEVICES_IN_PRODUCT_ID=your_product_id_here

BELIEVER_5_DEVICES_IN_PRODUCT_ID=your_product_id_here
TEAM_IN_PRODUCT_ID=your_product_id_here
```

## How to Get Product IDs

1. Log into your Dodo Payments dashboard
2. Navigate to Products section
3. Copy the product IDs for each corresponding plan/device combination
4. Replace `your_product_id_here` with the actual product IDs

## Features

- **Seamless Integration**: Overlay opens within the current page
- **Real-time Events**: Track payment lifecycle events
- **Error Handling**: Automatic error handling with user-friendly messages
- **Attribution Support**: Full support for device_id and app attribution
- **Locale Support**: Automatic regional pricing for India (PPP)

## Event Tracking

The overlay automatically tracks the following events:
- `payment_overlay_opened`: When checkout overlay opens
- `payment_overlay_closed`: When user closes overlay
- `payment_initiated`: When payment process starts
- `payment_success`: When payment redirect occurs
- `payment_error`: When errors occur

## Usage

The overlay is automatically initialized when the component loads and provides three main functions:

- `openCheckout()`: Opens the payment overlay
- `closeCheckout()`: Programmatically closes the overlay
- `isCheckoutOpen()`: Checks if overlay is currently open

## Testing

- Development mode uses Dodo's test environment automatically
- Production mode uses live payment processing
- Make sure to test with test product IDs in development

## Migration Notes

- Replaces the `/api/create-payment/[type]` route
- All tracking and error handling is now client-side
- Better UX with no page redirects
- Same pricing logic and product mapping as before 