import { GA_ID } from "@/libs/constants";

/**
 * Track page view using `gtag`
 *
 * @param {string}
 */
export default function trackPageView(url: string) {
	if (!window.gtag) return;

	window.gtag("config", GA_ID, {
		page_path: url,
	});
}
