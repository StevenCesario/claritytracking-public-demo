/**
 * ClarityTracking Tracker Snippet - Public Demo (v0.2.0)
 *
 * NOTE: This is a demo-grade script to showcase architectural concepts.
 * It demonstrates awareness of advanced tracking challenges (SPAs, redirects,
 * dynamic elements) and provides a clean API, but omits the full
 * proprietary implementation logic for event listeners and data capture.
 */
(function() {
  // Use a more descriptive name, avoiding potential conflicts
  const ClarityTrackingLogPrefix = '[ClarityTracking]';
  console.log(ClarityTrackingLogPrefix, 'Tracker Initializing (Demo Mode)...');

  // --- Configuration (Hardcoded for Demo) ---
  const WEBSITE_ID = '1'; // Demo Website ID
  const API_ENDPOINT = '/api/ingest/event'; // Uses Vite proxy

  // ===================================================================
  // 1. Helper Functions (Showcasing data collection)
  // ===================================================================

  /**
   * Reads a cookie value by name. Standard utility.
   * @param {string} name - The name of the cookie.
   * @returns {string | null} - The cookie value or null if not found.
   */
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift() || null;
    }
    return null;
  }

  /**
   * Extracts marketing parameters from URL and referrer.
   * @returns {object} - Marketing data object.
   */
  function getMarketingData() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('source') || undefined,
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      referer: document.referrer || undefined
    };
  }

  /**
   * Generates a simple, non-cryptographic event ID for demo purposes.
   * Shows awareness of deduplication.
   * @returns {string} A unique event ID.
   */
  function generateEventId() {
    return 'ctracking_evt_' + Date.now() + '.' + Math.random().toString(36).substring(2, 9);
  }

  /**
   * Gathers common user and marketing data.
   * @returns {object} - User data object, excluding undefined properties.
   */
  function getUserData() {
    const userData = {
      user_agent: navigator.userAgent || undefined,
      fbp: getCookie('_fbp') || undefined,
      fbc: getCookie('_fbc') || undefined,
      ...getMarketingData()
    };
    // Clean undefined/null/empty string properties before returning
    return Object.fromEntries(
        Object.entries(userData).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
  }

  // ===================================================================
  // 2. Core Data Pipeline (The "How")
  // ===================================================================

  /**
   * Sends a clean event payload to the ClarityTracking backend.
   * @param {object} eventData - The data conforming to the EventIngestData schema.
   */
  async function sendEvent(eventData) {
     // Clean the payload one last time before sending
     const cleanedPayload = Object.fromEntries(
        Object.entries(eventData).filter(([_, v]) => v !== undefined && v !== null && v !== '')
     );
     if (cleanedPayload.user_data) {
        cleanedPayload.user_data = Object.fromEntries(
            Object.entries(cleanedPayload.user_data).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
     }

    try {
      console.log(ClarityTrackingLogPrefix, 'Sending event:', cleanedPayload.event_name, cleanedPayload);
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Clarity-Token': WEBSITE_ID // Demo auth token
        },
        body: JSON.stringify(cleanedPayload),
        keepalive: true // Ensures data is sent even on page navigation
      });

      if (!response.ok) {
        console.error(ClarityTrackingLogPrefix, `API Error: ${response.status} ${response.statusText}`);
      } else {
        console.log(ClarityTrackingLogPrefix, `Event [${cleanedPayload.event_name}] potentially sent.`);
      }
    } catch (error) {
      console.error(ClarityTrackingLogPrefix, 'Fetch Setup Error:', error);
    }
  }

  // ===================================================================
  // 3. Public API & Event Handlers (The "What")
  // ===================================================================

  /**
   * Public-facing track function. This is the primary way
   * a website will send custom events to ClarityTracking.
   *
   * @param {string} eventName - The name of the event (e.g., "Purchase").
   * @param {object} [customData={}] - Event-specific data (e.g., { value: 99.99, currency: "USD" }).
   * @param {object} [userData={}] - Additional user data (e.g., { email: "..." }).
   */
  function track(eventName, customData = {}, userData = {}) {
    const eventPayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      event_source_url: window.location.href,
      // Merge base user data with any event-specific user data
      user_data: { ...getUserData(), ...userData },
      custom_data: customData
    };
    sendEvent(eventPayload);
  }

  // --- Initial PageView Track ---
  // We call this once the DOM is ready.
  function trackPageView() {
    track('PageView');
  }

  // --- Automatic Event Listeners (Architecture Showcase) ---
  // In the demo, these functions are stubs but demonstrate
  // the architectural considerations required for a robust tracker.

  /**
   * [DEMO STUB] Shows awareness of tracking form submissions.
   * Production version would listen for form 'submit' events,
   * grab data using new FormData(), and call track()
   * before the form submits.
   */
  function autoTrackFormSubmissions() {
    console.log(ClarityTrackingLogPrefix, 'Aware of form submissions. (Demo stub)');
    // const forms = document.querySelectorAll('form');
    // forms.forEach(form => {
    //   form.addEventListener('submit', (e) => {
    //     // Proprietary logic to capture form data...
    //     // track('FormSubmit', { form_id: form.id });
    //   });
    // });
  }

  /**
   * [DEMO STUB] Shows awareness of tracking clicks, especially
   * for redirects where 'sessionStorage' might be needed,
   * as seen in the CML script.
   */
  function autoTrackClicks() {
    console.log(ClarityTrackingLogPrefix, 'Aware of click tracking. (Demo stub)');
    // document.body.addEventListener('click', (e) => {
    //   if (e.target.matches('a.checkout-button')) {
    //     // Proprietary logic to capture data...
    //     // sessionStorage.setItem('clarity_checkout_data', '...');
    //     // track('InitiateCheckout');
    //   }
    // });
  }

  /**
   * [DEMO STUB] Shows awareness of SPA (React, Vue) route changes.
   * Production version would listen to 'popstate' and wrap
   * history.pushState/replaceState to trigger PageView events.
   */
  function handleSPARouteChanges() {
    console.log(ClarityTrackingLogPrefix, 'Aware of SPA routing. (Demo stub)');
    // window.addEventListener('popstate', trackPageView);
    // // const originalPushState = history.pushState;
    // // history.pushState = function(...) { ... trackPageView(); }
  }

  /**
   * [DEMO STUB] Shows awareness of dynamically loaded elements
   * (e.g., GHL forms), as seen in your GHL script.
   * Production version uses MutationObserver to find elements
   * that appear after the initial page load.
   */
  function observeDynamicElements() {
    console.log(ClarityTrackingLogPrefix, 'Aware of dynamic elements (MutationObserver). (Demo stub)');
    // const observer = new MutationObserver((mutations) => {
    //   // Proprietary logic to find and attach listeners...
    // });
    // observer.observe(document.body, { childList: true, subtree: true });
  }

  // ===================================================================
  // 4. Initialization
  // ===================================================================

  // Ensure PageView tracks only once DOM is ready
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', trackPageView);
  } else {
      // DOMContentLoaded has already fired
      trackPageView();
  }

  // Call auto-tracking stubs to show they're part of the flow
  autoTrackFormSubmissions();
  autoTrackClicks();
  handleSPARouteChanges();
  observeDynamicElements();

  // --- Expose Public API ---
  // This makes `window.claritytracking.track(...)` available to the website.
  window.claritytracking = window.claritytracking || {
    track: track
  };

})(); // IIFE