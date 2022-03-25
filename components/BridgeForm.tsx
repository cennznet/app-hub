import { BridgedEthereumToken, IntrinsicElements } from "@/types";
import { FC, useCallback, useEffect, useState } from "react";
import SubmitButton from "@/components/shared/SubmitButton";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useBridge } from "@/providers/BridgeProvider";
import useBridgeStatus from "@/hooks/useBridgeStatus";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { Balance, sendDepositRequest, sendWithdrawCENNZRequest } from "@/utils";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import sendWithdrawEthereumRequest from "@/utils/sendWithdrawEthereumRequest";

interface BridgeFormProps {}

const BridgeForm: FC<IntrinsicElements["form"] & BridgeFormProps> = ({
	children,
	...props
}) => {
	const { api } = useCENNZApi();
	const { wallet: metaMaskWallet } = useMetaMaskWallet();
	const {
		bridgeAction,
		transferInput,
		transferAsset,
		transferCENNZAddress,
		setProgressStatus,
		setSuccessStatus,
		setFailStatus,
		setTxStatus,
		updateMetaMaskBalances,
		transferMetaMaskAddress,
	} = useBridge();
	const [buttonLabel, setButtonLabel] = useState<string>("Deposit");
	const {
		updateBalances: updateCENNZBalances,
		selectedAccount: cennzAccount,
		wallet: cennzWallet,
	} = useCENNZWallet();

	const processDepositRequest = useCallback(async () => {
		const setTrValue = transferInput.setValue;
		const transferAmount = Balance.fromInput(
			transferInput.value,
			transferAsset
		);
		setProgressStatus();

		let tx: Awaited<ReturnType<typeof sendDepositRequest>>;

		try {
			tx = await sendDepositRequest(
				transferAmount,
				transferAsset,
				transferCENNZAddress,
				metaMaskWallet.getSigner()
			);
		} catch (error) {
			console.info(error);
			return setFailStatus(error?.code);
		}

		if (tx === "cancelled") return setTxStatus(null);

		setSuccessStatus();
		setTrValue("");
		updateMetaMaskBalances();
		updateCENNZBalances();
	}, [
		transferInput,
		transferAsset,
		transferCENNZAddress,
		metaMaskWallet,
		setProgressStatus,
		setSuccessStatus,
		setFailStatus,
		setTxStatus,
		updateMetaMaskBalances,
		updateCENNZBalances,
	]);

	const processWithdrawRequest = useCallback(async () => {
		const setTrValue = transferInput.setValue;
		const transferAmount = Balance.fromInput(
			transferInput.value,
			transferAsset
		);
		setProgressStatus();

		let eventProof: Awaited<ReturnType<typeof sendWithdrawCENNZRequest>>;
		try {
			eventProof = await sendWithdrawCENNZRequest(
				api,
				transferAmount,
				transferAsset as BridgedEthereumToken,
				cennzAccount.address,
				transferMetaMaskAddress,
				cennzWallet.signer
			);
		} catch (error) {
			console.info(error);
			return setFailStatus(error?.code);
		}

		if (eventProof === "cancelled") return setTxStatus(null);

		let tx: Awaited<ReturnType<typeof sendWithdrawEthereumRequest>>;
		try {
			tx = await sendWithdrawEthereumRequest(
				api,
				eventProof,
				transferAmount,
				transferAsset as BridgedEthereumToken,
				transferMetaMaskAddress,
				metaMaskWallet.getSigner()
			);
		} catch (error) {
			console.info(error);
			return setFailStatus(error?.code);
		}

		if (tx === "cancelled") return setTxStatus(null);

		setSuccessStatus();
		setTrValue("");
		updateMetaMaskBalances();
		updateCENNZBalances();
	}, [
		api,
		transferAsset,
		cennzAccount?.address,
		cennzWallet?.signer,
		setProgressStatus,
		setSuccessStatus,
		setFailStatus,
		setTxStatus,
		transferInput,
		transferMetaMaskAddress,
		updateMetaMaskBalances,
		updateCENNZBalances,
		metaMaskWallet,
	]);

	const onFormSubmit = useCallback(
		async (event) => {
			event.preventDefault();
			if (bridgeAction === "Deposit") return processDepositRequest();
			if (bridgeAction === "Withdraw") return processWithdrawRequest();
		},
		[bridgeAction, processDepositRequest, processWithdrawRequest]
	);

	const status = useBridgeStatus();

	useEffect(() => {
		if (bridgeAction === "Deposit") return setButtonLabel("Deposit");
		if (bridgeAction === "Withdraw") return setButtonLabel("Withdraw");
	}, [bridgeAction]);

	return (
		<form {...props} css={styles.root} onSubmit={onFormSubmit}>
			{children}

			<div css={styles.formSubmit}>
				<SubmitButton
					requireCENNZnet={true}
					requireMetaMask={true}
					disabled={status === "Inactive"}
				>
					{buttonLabel}
				</SubmitButton>

				{status === "Inactive" && (
					<div css={styles.formNote}>
						{bridgeAction} is temporarily deactivated, please try again later.
					</div>
				)}
			</div>
		</form>
	);
};

export default BridgeForm;

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

	formNote: ({ palette }: Theme) => css`
		font-size: 14px;
		margin: 1em auto 0em;
		color: ${palette.grey["800"]};
		width: 240px;
	`,
};
