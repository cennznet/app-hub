import { BridgeStatus } from "@/types";
import { getERC20PegContract } from "@/utils";
import { Api } from "@cennznet/api";
import { ethers } from "ethers";

// TODO: Needs test
export default async function fetchBridgeWithdrawStatus(
	api: Api,
	provider: ethers.providers.Web3Provider
): Promise<BridgeStatus> {
	const pegContract = getERC20PegContract<"ReadOnly">(provider);

	const [bridgePaused, cennzActive, ethActive] = await Promise.all([
		api.query.ethBridge.bridgePaused(),
		api.query.erc20Peg.withdrawalsActive(),
		pegContract.withdrawalsActive(),
	]);

	return (bridgePaused as any).isFalse &&
		(cennzActive as any).isTrue &&
		ethActive
		? "Active"
		: "Inactive";
}
