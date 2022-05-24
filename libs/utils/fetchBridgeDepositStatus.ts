import { BridgeStatus } from "@/libs/types";
import { getERC20PegContract } from "@utils";
import { Api } from "@cennznet/api";
import { ethers } from "ethers";

export default async function fetchBridgeDepositStatus(
	api: Api,
	provider: ethers.providers.Web3Provider
): Promise<BridgeStatus> {
	const pegContract = getERC20PegContract<"ReadOnly">(provider);

	const [cennzActive, ethActive] = await Promise.all([
		api.query.erc20Peg.depositsActive(),
		pegContract.depositsActive(),
	]);

	return (cennzActive as any).isTrue && ethActive ? "Active" : "Inactive";
}

export async function ensureBridgeDepositActive(
	api: Api,
	provider: ethers.providers.Web3Provider
) {
	const status = await fetchBridgeDepositStatus(api, provider);

	if (status === "Inactive") throw { code: "DEPOSIT_INACTIVE" };

	return status;
}
