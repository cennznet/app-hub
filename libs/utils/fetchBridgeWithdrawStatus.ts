import { BridgeStatus } from "@/libs/types";
import { getERC20PegContract } from "@/libs/utils";
import { Api } from "@cennznet/api";
import { ethers } from "ethers";

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

export async function ensureBridgeWithdrawActive(
	api: Api,
	provider: ethers.providers.Web3Provider
) {
	const status = await fetchBridgeWithdrawStatus(api, provider);

	if (status === "Inactive") throw { code: "WITHDRAW_INACTIVE" };

	return status;
}
