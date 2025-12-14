// Frisbii Checkout integration
// Based on: https://docs.frisbii.com/docs/embedded-checkout
declare global {
  interface Window {
    Reepay?: {
      WindowCheckout: new (sessionId: string) => any
      OverlayCheckout?: new (sessionId: string, options?: any) => any
      EmbeddedCheckout: new (
        sessionId: string | null,
        options?: {
          html_element?: string
          showReceipt?: boolean
        }
      ) => {
        addEventHandler: (event: any, callback: (data: any) => void) => void
        removeEventHandler: (event: any) => void
        show: (sessionId: string, options?: { showReceipt?: boolean }) => void
        destroy: () => void
      }
      Event: {
        Accept: string
        Error: string
        Close: string
      }
    }
  }
}

export function setupCheckout() {
  // Load Frisbii SDK
  // SDK URL from official docs: https://docs.frisbii.com/docs/new-web-shop
  const script = document.createElement("script")
  script.src = "https://checkout.reepay.com/checkout.js"
  script.async = true

  // Check if script already exists
  if (!document.querySelector('script[src*="checkout.reepay.com"]')) {
    document.head.appendChild(script)
  }

  const sessionIdInput = document.getElementById("session-id") as HTMLInputElement
  const openButton = document.getElementById("open-checkout") as HTMLButtonElement
  const checkoutContainer = document.getElementById("checkout-container") as HTMLDivElement

  // Open checkout handler
  openButton.addEventListener("click", async () => {
    const sessionId = sessionIdInput.value.trim()

    if (!sessionId) {
      alert("Please enter a checkout session ID")
      return
    }

    // Wait for SDK to load (with timeout)
    if (!window.Reepay) {
      try {
        await Promise.race([
          new Promise((resolve) => {
            script.onload = resolve
            script.onerror = () => {
              throw new Error("Failed to load SDK script")
            }
          }),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error("SDK load timeout")), 10000)
          }),
        ])
      } catch (error) {
        alert(
          `Failed to load Frisbii SDK: ${error}. Please check:\n1. Your internet connection\n2. The SDK URL is correct`
        )
        return
      }
    }

    if (!window.Reepay) {
      alert("Frisbii SDK (Reepay) not available. Please check the browser console.")
      return
    }

    // Check if EmbeddedCheckout is available
    if (!window.Reepay.EmbeddedCheckout) {
      alert(
        "Embedded checkout mode not available. The SDK may need to be updated or embedded mode may not be supported in this version."
      )
      return
    }

    // Clear previous checkout and create the required rp_container element
    // According to docs: https://docs.frisbii.com/docs/embedded-checkout
    // The element must be empty and have width/height specified (explicit height, not min-height)
    checkoutContainer.innerHTML = ""
    const rpContainer = document.createElement("div")
    rpContainer.id = "rp_container"
    checkoutContainer.appendChild(rpContainer)

    try {
      // Initialize embedded checkout according to official docs
      // Format: new Reepay.EmbeddedCheckout(sessionId, { html_element: 'rp_container' })
      const checkout = new window.Reepay.EmbeddedCheckout(sessionId, {
        html_element: "rp_container",
      })

      // Set up event handlers using .addEventHandler() as per docs
      // Event types: Reepay.Event.Accept, Reepay.Event.Error, Reepay.Event.Close
      checkout.addEventHandler(window.Reepay.Event.Accept, (data) => {
        console.log("Checkout successful!", data)
        alert("Payment successful!")
      })

      checkout.addEventHandler(window.Reepay.Event.Error, (data) => {
        console.error("Checkout error:", data)
        alert(`Error: ${data.error || "Unknown error"}`)
      })

      checkout.addEventHandler(window.Reepay.Event.Close, (data) => {
        console.log("Checkout closed", data)
      })

      // Store checkout instance for potential cleanup
      ;(window as any).__frisbiiCheckout = checkout
    } catch (error: any) {
      console.error("Failed to open checkout:", error)
      let errorMessage = "Failed to open checkout"
      if (error.name === "RP_MissingHtmlElementError") {
        errorMessage = "Container element 'rp_container' not found"
      } else if (error.name === "RP_HtmlElementNotEmptyError") {
        errorMessage = "Container element is not empty"
      } else if (error.message) {
        errorMessage = error.message
      }
      alert(`${errorMessage}: ${error}`)
    }
  })
}
