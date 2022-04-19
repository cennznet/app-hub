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
	sendWithdrawCENNZRequest,
	sendWithdrawEthereumRequest,
	waitForEventProof,
} from "@/utils";
import { EthyEventId } from "@cennznet/types";
import { useCallback } from "react";

export default function useWithdrawRequest(): () => Promise<void> {
	const {
		transferInput,
		transferAsset,
		transferMetaMaskAddress,
		setTxIdle,
		setTxPending,
		setTxSuccess,
		setTxFailure,
		updateMetaMaskBalances,
		setAdvancedExpanded,
	} = useBridge();
	const { api } = useCENNZApi();
	const {
		selectedAccount: cennzAccount,
		wallet: cennzWallet,
		updateBalances: updateCENNZBalances,
	} = useCENNZWallet();
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
			const tx = await sendWithdrawCENNZRequest(
				api,
				transferAmount,
				transferAsset as BridgedEthereumToken,
				cennzAccount.address,
				transferMetaMaskAddress,
				cennzWallet.signer
			);

			tx.on("txCancelled", () => setTxIdle());

			tx.on("txHashed", () => {
				setTxPending({
					relayerStatus: "CennznetConfirming",
				});
			});

			tx.on("txFailed", (errorCode) =>
				setTxFailure({
					errorCode,
				})
			);

			tx.on("txSucceeded", (result) => {
				const erc20WithdrawEvent = tx.findEvent(
					result,
					"erc20Peg",
					"Erc20Withdraw"
				);

				const eventProofId =
					erc20WithdrawEvent?.data?.[0].toJSON() as unknown as EthyEventId;

				if (!eventProofId)
					return setTxFailure({ errorCode: "erc20Peg.EventProofIdNotFound" });

				waitForEventProof(api, eventProofId)
					.then((eventProof) => {
						setTxPending({
							relayerStatus: "EthereumConfirming",
						});

						return sendWithdrawEthereumRequest(
							api,
							eventProof,
							transferAmount,
							transferAsset as BridgedEthereumToken,
							transferMetaMaskAddress,
							metaMaskWallet.getSigner()
						);
					})
					.then((withdrawTx) => {
						withdrawTx.on("txHashed", (_hash) => {
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
							setAdvancedExpanded(false);
							return setTxFailure({
								errorCode,
								txHashLink: withdrawTx.getHashLink(),
							});
						});

						withdrawTx.on("txCancelled", () => {
							setAdvancedExpanded(false);
							setTxIdle();
						});
					})
					.catch((error) => {
						console.info(error);
						return setTxFailure({
							errorCode: error?.code,
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
		transferInput.setValue,
		transferInput.value,
		transferAsset,
		setTxPending,
		extension,
		api,
		metaMaskWallet,
		cennzAccount?.address,
		transferMetaMaskAddress,
		cennzWallet?.signer,
		setTxIdle,
		setTxFailure,
		updateMetaMaskBalances,
		updateCENNZBalances,
		setTxSuccess,
		setAdvancedExpanded,
	]);
}
