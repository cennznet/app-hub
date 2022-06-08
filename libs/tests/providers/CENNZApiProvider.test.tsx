import { Api } from "@cennznet/api";
import { renderHook } from "@testing-library/react-hooks";
import CENNZApiProvider, {
	useCENNZApi,
} from "@/libs/providers/CENNZApiProvider";

test("should set expected `api` state", async () => {
	const wrapper = ({ children }) => (
		<CENNZApiProvider endpoint="wss://rata.centrality.me/public/ws">
			{children}
		</CENNZApiProvider>
	);

	const { result, waitForNextUpdate } = renderHook(() => useCENNZApi(), {
		wrapper,
	});

	await waitForNextUpdate({ timeout: 5000 });

	expect(result.current.api).toBeInstanceOf(Api);
});
