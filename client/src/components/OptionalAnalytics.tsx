import { useEffect } from "react";

const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.replace(/\/$/, "");
const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

export function OptionalAnalytics() {
  useEffect(() => {
    if (!analyticsEndpoint || !analyticsWebsiteId) return;

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-umaid-analytics="true"]',
    );
    if (existing) return;

    const script = document.createElement("script");
    script.defer = true;
    script.src = `${analyticsEndpoint}/umami`;
    script.dataset.websiteId = analyticsWebsiteId;
    script.dataset.umaidAnalytics = "true";
    document.head.appendChild(script);
  }, []);

  return null;
}
