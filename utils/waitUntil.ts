export default async function waitUntil(time: number = 0): Promise<"timeout"> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve("timeout");
		}, time);
	});
}
