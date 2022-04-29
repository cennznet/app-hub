import { useBridge } from "@/providers/BridgeProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import {
	Balance,
	ensureBridgeDepositActive,
	ensureRelayerDepositDone,
	sendDepositRequest,
} from "@/utils";
import { useCallback } from "react";

export default function useDepositRequest(): () => Promise<void> {
	const { api } = useCENNZApi();
	const { wallet: metaMaskWallet } = useMetaMaskWallet();
	const { updateBalances: updateCENNZBalances } = useCENNZWallet();
	const {
		transferInput,
		transferAsset,
		transferCENNZAddress,
		setTxIdle,
		setTxPending,
		setTxSuccess,
		setTxFailure,
		updateMetaMaskBalances,
	} = useBridge();

	return useCallback(async () => {
		const setTrValue = transferInput.setValue;
		const transferAmount = Balance.fromInput(
			transferInput.value,
			transferAsset
		);

		try {
			setTxPending();
			await ensureBridgeDepositActive(api, metaMaskWallet);
			const tx = await sendDepositRequest(
				transferAmount,
				transferAsset,
				transferCENNZAddress,
				metaMaskWallet.getSigner()
			);

			tx.on("txCancelled", () => setTxIdle());

			tx.on("txHashed", () => {
				setTxPending({
					txHashLink: tx.getHashLink(),
				});
			});

			tx.on("txFailed", (errorCode) =>
				setTxFailure({
					errorCode,
					txHashLink: tx.getHashLink(),
				})
			);

			tx.on("txSucceeded", () => {
				ensureRelayerDepositDone(tx.hash, 600000, (status) =>
					setTxPending({ relayerStatus: status, txHashLink: tx.getHashLink() })
				)
					.then(() => {
						setTrValue("");
						updateMetaMaskBalances();
						updateCENNZBalances();
						setTxSuccess({
							transferValue: transferAmount,
							txHashLink: tx.getHashLink(),
						});
					})
					.catch((error) => {
						console.info(error);
						return setTxFailure({
							errorCode: error?.code,
							txHashLink: tx.getHashLink(),
						});
					});
			});
		} catch (error) {
			console.info(error);
			return setTxFailure({
				errorCode: error?.code,
			});
		}
	}, [
		api,
		transferInput,
		transferAsset,
		transferCENNZAddress,
		metaMaskWallet,
		updateMetaMaskBalances,
		updateCENNZBalances,
		setTxIdle,
		setTxFailure,
		setTxPending,
		setTxSuccess,
	]);
}
