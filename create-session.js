/**
 * Helper script to create a Frisbii checkout session
 * Based on: https://docs.frisbii.com/docs/new-web-shop
 *
 * Usage:
 *   node create-session.js YOUR_PRIVATE_API_KEY [CONFIGURATION_HANDLE]
 *
 * Or set FRISBII_API_KEY environment variable:
 *   FRISBII_API_KEY=priv_xxx node create-session.js [CONFIGURATION_HANDLE]
 *
 * Note: Uses HTTP Basic Auth (not Bearer token)
 *
 * CONFIGURATION_HANDLE: Optional. The handle of your checkout configuration.
 *   - If not specified, uses the default configuration
 *   - Find your configuration handle in: Configurations > Checkout management > Checkout
 *   - The handle is shown in the configuration list (e.g., "default", "custom-brand")
 */

const apiKey = process.argv[2] || process.env.FRISBII_API_KEY
const configurationHandle = process.argv[3] || process.env.FRISBII_CONFIGURATION_HANDLE

if (!apiKey) {
  console.error("Error: Private API key required")
  console.log("Usage: node create-session.js YOUR_PRIVATE_API_KEY [CONFIGURATION_HANDLE]")
  console.log("Or: FRISBII_API_KEY=priv_xxx node create-session.js [CONFIGURATION_HANDLE]")
  console.log("\nGet your API key from: https://app.frisbii.com > Developers > API Credentials")
  console.log("\nConfiguration Handle:")
  console.log("  - Optional. Specify which checkout configuration to use")
  console.log("  - Find it in: Configurations > Checkout management > Checkout")
  console.log("  - If omitted, uses the default configuration")
  process.exit(1)
}

// HTTP Basic Auth: base64(apiKey:)
// Note: The colon after the API key is required
const basicAuth = Buffer.from(`${apiKey}:`).toString("base64")

async function createCheckoutSession() {
  try {
    const response = await fetch("https://checkout-api.frisbii.com/v1/session/charge", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order: {
          handle: `order-${Date.now()}`,
          amount: 10000, // 100.00 DKK in øre (smallest currency unit)
          currency: "DKK",
          settle: true,
          customer: {
            email: "jonas.palm@apply.agency",
            handle: "c-test",
            first_name: "Test",
            last_name: "User",
          },
        },
        ...(configurationHandle && { configuration: configurationHandle }), // Add configuration handle if provided
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    const session = await response.json()
    console.log("\n✅ Checkout session created successfully!\n")
    console.log("Session ID:", session.id)
    console.log("Session URL:", session.url)
    if (configurationHandle) {
      console.log("Configuration:", configurationHandle)
    } else {
      console.log("Configuration: default (no custom configuration specified)")
    }
    console.log("\nCopy the Session ID and paste it into the demo app.\n")
  } catch (error) {
    console.error("Failed to create checkout session:", error.message)
    console.error("\nMake sure:")
    console.error("1. Your API key is correct (starts with priv_)")
    console.error("2. You have the required permissions")
    console.error("3. Your network allows outbound requests")
    process.exit(1)
  }
}

createCheckoutSession()
