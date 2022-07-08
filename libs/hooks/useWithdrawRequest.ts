import { useBridge } from "@/libs/providers/BridgeProvider";
import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/libs/providers/CENNZWalletProvider";
import { useMetaMaskExtension } from "@/libs/providers/MetaMaskExtensionProvider";
import { useMetaMaskWallet } from "@/libs/providers/MetaMaskWalletProvider";
import { BridgedEthereumToken } from "@/libs/types";
import {
	Balance,
	ensureBridgeWithdrawActive,
	ensureEthereumChain,
	sendWithdrawEthereumRequest,
} from "@/libs/utils";
import { EthyEventId } from "@cennznet/types";
import { useCallback } from "react";
import { useWalletProvider } from "@/libs/providers/WalletProvider";
import { useSelectedAccount, useUpdateCENNZBalances } from "@/libs/hooks";

export default function useWithdrawRequest(): () => Promise<void> {
	const {
		transferInput,
		transferAsset,
		transferMetaMaskAddress,
		setTxIdle,
		setTxPending,
		setTxSuccess,
		setTxFailure,
		updateEthereumBalances,
		updateUnclaimedWithdrawals,
	} = useBridge();
	const { api } = useCENNZApi();
	const { wallet: cennzWallet } = useCENNZWallet();
	const { wallet: metaMaskWallet } = useMetaMaskWallet();
	const { extension } = useMetaMaskExtension();
	const { selectedWallet } = useWalletProvider();

	const selectedAccount = useSelectedAccount();
	const updateCENNZBalances = useUpdateCENNZBalances();

	return useCallback(async () => {
		const transferAmount = Balance.fromInput(
			transferInput.value,
			transferAsset
		);

		try {
			await ensureEthereumChain(extension);
			await ensureBridgeWithdrawActive(api, metaMaskWallet);

			const eventProof = await api.derive.ethBridge.eventProof(
				433 as unknown as EthyEventId // Event proof id from user's withdrawal
			);

			await sendWithdrawEthereumRequest(
				api,
				eventProof,
				transferAmount,
				transferAsset as BridgedEthereumToken,
				"0x8b7f8afef51534bb860900433ed69f282f070ef8", // User's ETH address
				metaMaskWallet.getSigner()
			);
		} catch (error) {
			console.info(error);
			return setTxFailure({
				errorCode: error?.code,
			});
		}
	}, [
		transferInput.setValue,
		transferInput.value,
		transferAsset,
		setTxPending,
		extension,
		api,
		metaMaskWallet,
		selectedAccount?.address,
		transferMetaMaskAddress,
		cennzWallet?.signer,
		setTxIdle,
		setTxFailure,
		updateEthereumBalances,
		updateCENNZBalances,
		setTxSuccess,
		updateUnclaimedWithdrawals,
		selectedWallet,
	]);
}
