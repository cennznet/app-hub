export default async function waitUntil(
	time: number = 1000
): Promise<"timeout"> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve("timeout");
		}, time);
	});
}
