import { useBridge } from "@/providers/BridgeProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useMetaMaskExtension } from "@/providers/MetaMaskExtensionProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { BridgedEthereumToken } from "@/types";
import {
	Balance,
	ensureBridgeWithdrawActive,
	ensureEthereumChain,
	sendWithdrawEthereumRequest,
} from "@/utils";
import { EthEventProof } from "@cennznet/api/derives/ethBridge/types";
import { EthyEventId } from "@cennznet/types";
import { useCallback } from "react";

export default function useHistoricalWithdrawRequest(): () => Promise<void> {
	const {
		transferInput,
		transferAsset,
		transferMetaMaskAddress,
		setTxIdle,
		setTxPending,
		setTxSuccess,
		setTxFailure,
		updateMetaMaskBalances,
		historicalEventProofId,
		historicalBlockHash,
	} = useBridge();
	const { api } = useCENNZApi();
	const { updateBalances: updateCENNZBalances } = useCENNZWallet();
	const { wallet: metaMaskWallet } = useMetaMaskWallet();
	const { extension } = useMetaMaskExtension();

	return useCallback(async () => {
		const setTrValue = transferInput.setValue;
		const transferAmount = Balance.fromInput(
			transferInput.value,
			transferAsset
		);

		try {
			setTxPending();
			await ensureEthereumChain(extension);
			await ensureBridgeWithdrawActive(api, metaMaskWallet);
			const eventProof: EthEventProof = await api.derive.ethBridge.eventProof(
				historicalEventProofId as unknown as EthyEventId
			);

			console.log({ eventProof });

			setTxPending({
				relayerStatus: "EthereumConfirming",
			});

			sendWithdrawEthereumRequest(
				api,
				eventProof,
				transferAmount,
				transferAsset as BridgedEthereumToken,
				transferMetaMaskAddress,
				metaMaskWallet.getSigner(),
				historicalBlockHash
			)
				.then((withdrawTx) => {
					withdrawTx.on("txHashed", (hash) => {
						setTxPending({
							relayerStatus: "EthereumConfirming",
							txHashLink: withdrawTx.getHashLink(),
						});
					});

					withdrawTx.on("txSucceeded", () => {
						setTrValue("");
						updateMetaMaskBalances();
						updateCENNZBalances();
						setTxSuccess({
							transferValue: transferAmount,
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
	}, [
		transferInput.setValue,
		transferInput.value,
		transferAsset,
		setTxPending,
		extension,
		api,
		metaMaskWallet,
		historicalEventProofId,
		transferMetaMaskAddress,
		historicalBlockHash,
		updateMetaMaskBalances,
		updateCENNZBalances,
		setTxSuccess,
		setTxFailure,
		setTxIdle,
	]);
}
