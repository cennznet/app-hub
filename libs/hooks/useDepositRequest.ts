import { useBridge } from "@providers/BridgeProvider";
import { useCENNZApi } from "@providers/CENNZApiProvider";
import { useMetaMaskExtension } from "@providers/MetaMaskExtensionProvider";
import { useMetaMaskWallet } from "@providers/MetaMaskWalletProvider";
import {
	Balance,
	ensureBridgeDepositActive,
	ensureEthereumChain,
	ensureRelayerDepositDone,
	sendDepositRequest,
} from "@utils";
import { useCallback } from "react";
import { useWalletProvider } from "@providers/WalletProvider";
import { cvmToAddress } from "@cennznet/types/utils";
import { useUpdateCENNZBalances } from "@hooks";

export default function useDepositRequest(): () => Promise<void> {
	const { api } = useCENNZApi();
	const { wallet: metaMaskWallet } = useMetaMaskWallet();
	const { extension } = useMetaMaskExtension();
	const { selectedWallet } = useWalletProvider();
	const {
		transferInput,
		transferAsset,
		transferCENNZAddress,
		setTxIdle,
		setTxPending,
		setTxSuccess,
		setTxFailure,
		updateEthereumBalances,
		transferMetaMaskAddress,
	} = useBridge();

	const updateCENNZBalances = useUpdateCENNZBalances();

	return useCallback(async () => {
		const setTrValue = transferInput.setValue;
		const transferAmount = Balance.fromInput(
			transferInput.value,
			transferAsset
		);

		const cennzAddress =
			selectedWallet === "CENNZnet"
				? transferCENNZAddress
				: cvmToAddress(transferMetaMaskAddress);

		try {
			setTxPending();
			await ensureEthereumChain(extension);
			await ensureBridgeDepositActive(api, metaMaskWallet);
			const tx = await sendDepositRequest(
				transferAmount,
				transferAsset,
				cennzAddress,
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
						updateEthereumBalances();
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
		transferMetaMaskAddress,
		metaMaskWallet,
		updateEthereumBalances,
		updateCENNZBalances,
		extension,
		setTxIdle,
		setTxFailure,
		setTxPending,
		setTxSuccess,
		selectedWallet,
	]);
}
