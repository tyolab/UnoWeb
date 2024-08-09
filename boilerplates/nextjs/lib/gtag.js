export const NEXT_PUBLIC_GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "G-9MWSKJECC6";

/** 
 * For GTAG
 */
// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  window.gtag("config", NEXT_PUBLIC_GTM_ID, {
    page_path: url
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value
  });
};
