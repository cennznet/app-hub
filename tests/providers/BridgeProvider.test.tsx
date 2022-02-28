import { act, renderHook } from "@testing-library/react-hooks";
import BridgeProvider, { useBridge } from "@/providers/BridgeProvider";
import { mock } from "@depay/web3-mock";

const blockchain = "ethereum";
const wallet = "metamask";
const accounts = ["0x699aC2aedF058e76eD900FCc8cB31aB316B35bF2"];

beforeAll(() => {
	mock({
		blockchain,
		wallet,
		accounts,
	});
});

test("initBridge should set expected Contracts, Account & Signer", async () => {
	const wrapper = ({ children }) => (
		<BridgeProvider ethChainId="1">{children}</BridgeProvider>
	);

	const { result } = renderHook(() => useBridge(), {
		wrapper,
	});

	await act(async () => {
		await result.current.initBridge(global.ethereum, accounts);
	});

	const { bridge, peg }: any = result.current.Contracts;
	const { Account, Signer }: any = result.current;

	expect(bridge.address).toEqual("0x369e2285CCf43483e76746cebbf3d1d6060913EC");
	expect(peg.address).toEqual("0x8F68fe02884b2B05e056aF72E4F2D2313E9900eC");
	expect(Account).toEqual(accounts[0]);
	expect(Signer).toBeDefined();
});
