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
import { useWalletProvider } from "@/providers/WalletProvider";
import { useSelectedAccount, useUpdateCENNZBalances } from "@/hooks";

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
				selectedAccount.address,
				transferMetaMaskAddress,
				cennzWallet?.signer,
				selectedWallet,
				extension
			);

			tx.on("txCancelled", () => setTxIdle());

			tx.on("txHashed", () => {
				setTxPending({
					relayerStatus: "CennznetConfirming",
				});
			});

			tx.on("txFailed", (result) =>
				setTxFailure({
					errorCode: tx.decodeError(result),
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
							setTxSuccess({
								transferValue: transferAmount,
								txHashLink: withdrawTx.getHashLink(),
							});
						});

						withdrawTx.on("txFailed", (errorCode) => {
							updateUnclaimedWithdrawals();
							return setTxFailure({
								errorCode,
								txHashLink: withdrawTx.getHashLink(),
							});
						});

						withdrawTx.on("txCancelled", () => {
							updateMetaMaskBalances();
							updateCENNZBalances();
							updateUnclaimedWithdrawals();
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
		selectedAccount?.address,
		transferMetaMaskAddress,
		cennzWallet?.signer,
		setTxIdle,
		setTxFailure,
		updateMetaMaskBalances,
		updateCENNZBalances,
		setTxSuccess,
		updateUnclaimedWithdrawals,
		selectedWallet,
	]);
}
