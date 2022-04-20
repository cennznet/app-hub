import { useBridge } from "@/providers/BridgeProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useMetaMaskExtension } from "@/providers/MetaMaskExtensionProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { WithdrawClaim } from "@/types";
import {
	ensureBridgeWithdrawActive,
	ensureEthereumChain,
	sendWithdrawEthereumRequest,
} from "@/utils";
import { EthEventProof } from "@cennznet/api/derives/ethBridge/types";
import { EthyEventId } from "@cennznet/types";
import { useCallback } from "react";

export default function useHistoricalWithdrawRequest(): (
	unclaimed: WithdrawClaim
) => Promise<void> {
	const {
		transferInput,
		transferSelect,
		transferMetaMaskAddress,
		setTxIdle,
		setTxPending,
		setTxSuccess,
		setTxFailure,
		updateMetaMaskBalances,
		updateUnclaimedWithdrawals,
	} = useBridge();
	const { api } = useCENNZApi();
	const { updateBalances: updateCENNZBalances } = useCENNZWallet();
	const { wallet: metaMaskWallet } = useMetaMaskWallet();
	const { extension } = useMetaMaskExtension();

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
				const eventProof: EthEventProof = await api.derive.ethBridge.eventProof(
					unclaimed.eventProofId as unknown as EthyEventId
				);

				console.log({ eventProof });

				setTxPending({
					relayerStatus: "EthereumConfirming",
				});

				sendWithdrawEthereumRequest(
					api,
					eventProof,
					unclaimed.transferAmount,
					unclaimed.transferAsset,
					transferMetaMaskAddress,
					metaMaskWallet.getSigner(),
					eventProof.blockHash
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
							updateMetaMaskBalances();
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
			transferMetaMaskAddress,
			updateMetaMaskBalances,
			updateCENNZBalances,
			setTxSuccess,
			setTxFailure,
			setTxIdle,
			updateUnclaimedWithdrawals,
		]
	);
}
