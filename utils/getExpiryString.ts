export function getDaysHoursMinutes(expiresAt): string {
	const distance = getDistance(expiresAt);

	if (distance <= 0) return "Expired";

	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

	return `${days}d ${hours}h ${minutes}m`;
}

export function getMinutesAndSeconds(expiresAt): string {
	const distance = getDistance(expiresAt);

	if (distance <= 0) return "Expired";

	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((distance % (1000 * 60)) / 1000);

	return `${minutes}m ${seconds}s`;
}

function getDistance(expiresAt): number {
	const expiry = expiresAt * 1000;
	return expiry - Date.now();
}
