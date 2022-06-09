import { renderHook, waitFor } from "@testing-library/react";
import UserAgentProvider, {
	useUserAgent,
} from "@/libs/providers/UserAgentProvider";

test("should set expected `userAgent` state", async () => {
	const wrapper = ({ children }) => (
		<UserAgentProvider value="Mozilla/5.0 (Macintosh; Intel Mac OS X 12_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36">
			{children}
		</UserAgentProvider>
	);
	const { result } = renderHook(() => useUserAgent(), {
		wrapper,
	});

	await waitFor(() => {
		const { browser, os } = result.current;

		expect(browser.name).toEqual("Chrome");
		expect(os.name).toEqual("Mac OS");
	});
});
