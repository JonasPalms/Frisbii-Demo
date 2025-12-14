# Quick Start: Creating a Test Session ID

## Step 1: Get Your API Key

1. Go to https://app.frisbii.com
2. Log in with your test user account
3. Navigate to **Developers > API Credentials**
4. Copy your **Private API Key** (it starts with `priv_`)

⚠️ **Important**: Keep this key secret! Never commit it to git or expose it in frontend code.

## Step 2: Create a Session ID

### Option A: Using the Helper Script (Easiest)

```bash
# Replace priv_xxx with your actual API key
node create-session.js priv_11111111111111111111111111111111
```

Or using environment variable:
```bash
FRISBII_API_KEY=priv_xxx node create-session.js
```

The script will output:
- ✅ Session ID (e.g., `cs_51514ad655dbcd515b2ba4e81d55ca02`)
- Session URL

**Copy the Session ID** and paste it into the demo app.

### Option B: Using curl (Alternative)

```bash
curl -X POST https://checkout-api.frisbii.com/v1/session/charge \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -u 'priv_11111111111111111111111111111111:' \
  -d '{
    "order": {
      "handle": "order-test-123",
      "amount": 10000,
      "currency": "DKK",
      "customer": {
        "email": "[email protected]",
        "handle": "c-test",
        "first_name": "Test",
        "last_name": "User"
      }
    },
    "accept_url": "http://localhost:5173/accept",
    "cancel_url": "http://localhost:5173/cancel"
  }'
```

Look for the `"id"` field in the response - that's your session ID.

## Step 3: Use the Session ID in the Demo

1. Start the dev server: `npm run dev`
2. Open http://localhost:5173
3. Paste your Session ID into the input field
4. Customize colors and click "Open Checkout"

## Troubleshooting

**"Failed to create checkout session"**
- Make sure your API key is correct (starts with `priv_`)
- Check that you're using test mode credentials
- Verify your network connection

**"SDK not available"**
- Check browser console for errors
- Make sure the SDK URL is correct (should be `https://checkout.reepay.com/checkout.js`)

**Session ID format**
- Should start with `cs_` (e.g., `cs_51514ad655dbcd515b2ba4e81d55ca02`)

