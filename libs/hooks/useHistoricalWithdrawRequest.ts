import { useBridge } from "@providers/BridgeProvider";
import { useCENNZApi } from "@providers/CENNZApiProvider";
import { useMetaMaskExtension } from "@providers/MetaMaskExtensionProvider";
import { useMetaMaskWallet } from "@providers/MetaMaskWalletProvider";
import { WithdrawClaim } from "@/libs/types";
import {
	ensureBridgeWithdrawActive,
	ensureEthereumChain,
	sendWithdrawEthereumRequest,
} from "@/libs/utils";
import { useCallback } from "react";
import { useUpdateCENNZBalances } from "@hooks";

export default function useHistoricalWithdrawRequest(): (
	unclaimed: WithdrawClaim
) => Promise<void> {
	const {
		transferInput,
		transferSelect,
		setTxIdle,
		setTxPending,
		setTxSuccess,
		setTxFailure,
		updateEthereumBalances,
		updateUnclaimedWithdrawals,
	} = useBridge();
	const { api } = useCENNZApi();
	const { wallet: metaMaskWallet } = useMetaMaskWallet();
	const { extension } = useMetaMaskExtension();

	const updateCENNZBalances = useUpdateCENNZBalances();

	return useCallback(
		async (unclaimed) => {
			const setTrValue = transferInput.setValue;
			const setToken = transferSelect.setTokenId;

			setTrValue(unclaimed.transferAmount.toInput());
			setToken(unclaimed.transferAsset.address);

			try {
				setTxPending();
				await ensureEthereumChain(extension);
				await ensureBridgeWithdrawActive(api, metaMaskWallet);

				setTxPending({
					relayerStatus: "EthereumConfirming",
				});

				sendWithdrawEthereumRequest(
					api,
					unclaimed.eventProof,
					unclaimed.transferAmount,
					unclaimed.transferAsset,
					unclaimed.beneficiary,
					metaMaskWallet.getSigner()
				)
					.then((withdrawTx) => {
						withdrawTx.on("txHashed", () => {
							setTxPending({
								relayerStatus: "EthereumConfirming",
								txHashLink: withdrawTx.getHashLink(),
							});
						});

						withdrawTx.on("txSucceeded", () => {
							setTrValue("");
							updateEthereumBalances();
							updateCENNZBalances();
							updateUnclaimedWithdrawals();
							setTxSuccess({
								transferValue: unclaimed.transferAmount,
								txHashLink: withdrawTx.getHashLink(),
							});
						});

						withdrawTx.on("txFailed", (errorCode) => {
							return setTxFailure({
								errorCode,
								txHashLink: withdrawTx.getHashLink(),
							});
						});

						withdrawTx.on("txCancelled", () => setTxIdle());
					})
					.catch((error) => {
						console.info(error);
						return setTxFailure({
							errorCode: error?.code,
						});
					});
			} catch (error) {
				console.info(error);
				return setTxFailure({
					errorCode: error?.code,
				});
			}
		},
		[
			transferInput.setValue,
			transferSelect.setTokenId,
			setTxPending,
			extension,
			api,
			metaMaskWallet,
			updateEthereumBalances,
			updateCENNZBalances,
			setTxSuccess,
			setTxFailure,
			setTxIdle,
			updateUnclaimedWithdrawals,
		]
	);
}
