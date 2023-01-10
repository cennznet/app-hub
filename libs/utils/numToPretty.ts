export default function numToPretty(num: number): string {
	return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
