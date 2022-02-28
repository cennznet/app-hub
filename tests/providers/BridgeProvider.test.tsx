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

	expect(bridge.address).toEqual("0xf7997B93437d5d2AC226f362EBF0573ce7a53930");
	expect(peg.address).toEqual("0x76BAc85e1E82cd677faa2b3f00C4a2626C4c6E32");
	expect(Account).toEqual(accounts[0]);
	expect(Signer).toBeDefined();
});
