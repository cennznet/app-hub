import {
	CENNZnetExtrinsic,
	IntrinsicElements,
	SubmittableExtrinsic,
} from "@/types";
import { FC, useCallback } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import SubmitButton from "@/components/shared/SubmitButton";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import {
	Balance,
	CENNZTransaction,
	signAndSendTx,
	signViaEthWallet,
} from "@/utils";
import { useWalletProvider } from "@/providers/WalletProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { useMetaMaskExtension } from "@/providers/MetaMaskExtensionProvider";
import { useUpdateCENNZBalances } from "@/hooks";
import getBatchTransferAssetExtrinsic from "@/utils/getBatchTransferAssetExtrinsic";
import { useTransfer } from "@/providers/TransferProvider";
import isEthereumAddress from "@/utils/isEthereumAddress";
import { cvmToAddress } from "@cennznet/types/utils";

interface TransferFormProps {}

const TransferForm: FC<IntrinsicElements["form"] & TransferFormProps> = ({
	children,
	...props
}) => {
	const { api } = useCENNZApi();
	const { selectedWallet } = useWalletProvider();
	const { selectedAccount: cennzAccount, wallet } = useCENNZWallet();
	const { selectedAccount: metaMaskAccount } = useMetaMaskWallet();
	const { extension } = useMetaMaskExtension();

	const updateCENNZBalances = useUpdateCENNZBalances();
	const {
		setTxIdle,
		setTxPending,
		setTxSuccess,
		setTxFailure,
		receiveAddress,
		transferAssets,
		resetDisplayAssets,
	} = useTransfer();
	const onFormSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			if (!api) return;

			try {
				setTxPending();
				const extrinsic = getBatchTransferAssetExtrinsic(
					api,
					transferAssets,
					isEthereumAddress(receiveAddress)
						? cvmToAddress(receiveAddress)
						: receiveAddress
				);

				let tx: CENNZTransaction;
				if (selectedWallet === "CENNZnet")
					tx = await signAndSendTx(
						extrinsic as SubmittableExtrinsic<"promise">,
						cennzAccount.address,
						wallet.signer
					);
				if (selectedWallet === "MetaMask")
					tx = await signViaEthWallet(
						api,
						metaMaskAccount.address,
						extrinsic as CENNZnetExtrinsic,
						extension
					);

				tx.on("txCancelled", () => setTxIdle());

				tx.on("txHashed", () => {
					setTxPending({
						txHashLink: tx.getHashLink(),
					});
				});

				tx.on("txFailed", (result) =>
					setTxFailure({
						errorCode: tx.decodeError(result),
						txHashLink: tx.getHashLink(),
					})
				);

				tx.on("txSucceeded", (result) => {
					const events = tx.findEvents(result, "genericAsset", "Transferred");
					const transferValues: Balance[] = events.map((event, index) => {
						return Balance.fromCodec(event.data[3], transferAssets[index]);
					});
					updateCENNZBalances();
					setTxSuccess({
						transferValues,
						txHashLink: tx.getHashLink(),
					});
					resetDisplayAssets();
				});
			} catch (error) {
				console.info(error);
				return setTxFailure({ errorCode: error?.code as string });
			}
		},
		[
			api,
			setTxPending,
			transferAssets,
			receiveAddress,
			selectedWallet,
			cennzAccount?.address,
			wallet?.signer,
			metaMaskAccount?.address,
			extension,
			setTxIdle,
			setTxFailure,
			updateCENNZBalances,
			setTxSuccess,
			resetDisplayAssets,
		]
	);

	return (
		<form {...props} css={styles.root} onSubmit={onFormSubmit}>
			{children}

			<div css={styles.formSubmit}>
				<SubmitButton>Transfer</SubmitButton>
			</div>
		</form>
	);
};

export default TransferForm;

const styles = {
	root: css`
		width: 100%;
		position: relative;
	`,

	formSubmit: ({ palette }: Theme) => css`
		text-align: center;
		border-top: 1px solid ${palette.divider};
		padding-top: 2em;
		margin: 2em -2.5em 0;
	`,
};
