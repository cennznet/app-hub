import { Api } from "@cennznet/api";
import { renderHook, waitFor } from "@testing-library/react";
import CENNZApiProvider, {
	useCENNZApi,
} from "@/libs/providers/CENNZApiProvider";

test("should set expected `api` state", async () => {
	const wrapper = ({ children }) => (
		<CENNZApiProvider endpoint="wss://rata.centrality.me/public/ws">
			{children}
		</CENNZApiProvider>
	);

	const { result } = renderHook(() => useCENNZApi(), {
		wrapper,
	});

	await waitFor(() => expect(result.current.api).toBeInstanceOf(Api), {
		timeout: 5000,
	});
});
