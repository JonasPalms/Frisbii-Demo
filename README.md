# Frisbii Checkout Styling Demo

A simple demo project to test styling options (especially colors) for Frisbii's embedded checkout flow.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a checkout session using Frisbii API:
   - You'll need your API key from your Frisbii account
   - Create a checkout session via the API (see example below)
   - Copy the session ID

3. Run the development server:
```bash
npm run dev
```

4. Open the app in your browser and:
   - Enter your checkout session ID (get it from your backend)
   - Customize colors using the color pickers
   - Click "Open Checkout" to see the styled checkout

## Creating a Checkout Session

**Important:** Checkout sessions must be created server-side using your private API key. Never expose your private API key in frontend code.

You can create a checkout session using curl:

```bash
curl -X POST https://checkout-api.frisbii.com/v1/session/charge \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -u 'priv_11111111111111111111111111111111:' \
  -d '{
    "order": {
      "handle": "order-12345",
      "amount": 10000,
      "currency": "DKK",
      "customer": {
        "email": "[email protected]",
        "handle": "c-0212",
        "first_name": "John",
        "last_name": "Doe"
      }
    },
    "accept_url": "https://your-site.com/accept",
    "cancel_url": "https://your-site.com/cancel"
  }'
```

**Note:** 
- Use HTTP Basic Auth (not Bearer token): `-u 'priv_xxx:'` (note the colon)
- The API key must be base64 encoded: `base64(priv_xxx:)`
- Amount is in the smallest currency unit (e.g., øre for DKK, cents for USD)

Or use the helper script:
```bash
node create-session.js priv_11111111111111111111111111111111
```

Or use the Frisbii Checkout Helper tool in your dashboard: https://app.frisbii.com

## Styling Options

The demo allows you to test:
- **Primary Color**: Main brand color
- **Accent Color**: Secondary/highlight color
- **Background Color**: Checkout background
- **Text Color**: Main text color

## Deployment to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

1. Update `vite.config.ts` with your repository name:
```typescript
base: '/your-repo-name/', // Change 'frisbii-demo' to your actual repo name
```

2. Push to GitHub and enable GitHub Pages:
   - Go to your repository Settings > Pages
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy on push to `main` branch

### Option 2: Manual Deployment

1. Update `vite.config.ts` with your repository name (same as above)

2. Install gh-pages (already in devDependencies):
```bash
npm install
```

3. Deploy:
```bash
npm run deploy
```

Note: Make sure your GitHub repository is set up and GitHub Pages is enabled in repository settings.

## Notes

- **SDK URL**: Uses official Frisbii SDK from `https://checkout.reepay.com/checkout.js` (as per [official docs](https://docs.frisbii.com/docs/new-web-shop))
- **SDK API**: Uses `Reepay` namespace (legacy naming from Billwerk+ rebrand)
- **Session ID**: Format is `cs_51514ad655dbcd515b2ba4e81d55ca02` (starts with `cs_`)
- **API Key**: Only needed server-side to create sessions. Never expose private API keys in frontend code.
- Make sure to use test mode credentials for testing
- The embedded checkout API structure may vary - check [Frisbii Embedded Checkout docs](https://docs.frisbii.com/docs/embedded-checkout) for exact options

## Troubleshooting

If the checkout doesn't open:
1. Check the browser console for errors
2. Verify the SDK URL is correct in `src/checkout.ts`
3. Ensure your checkout session ID is valid
4. Check Frisbii's documentation for the correct SDK integration method

