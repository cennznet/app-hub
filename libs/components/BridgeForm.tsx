import { FC, useCallback, useEffect, useState } from "react";
import { IntrinsicElements } from "@/libs/types";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useBridge } from "@/libs/providers/BridgeProvider";
import { useBridgeStatus } from "@/libs/hooks";
import { SubmitButton, BridgeWithdrawAdvanced } from "@/libs/components";
import { useDepositRequest, useWithdrawRequest } from "@/libs/hooks";
import { useWalletProvider } from "@/libs/providers/WalletProvider";
import { ETHEREUM_NETWORK } from "@/libs/constants";

interface BridgeFormProps {}

const BridgeForm: FC<IntrinsicElements["form"] & BridgeFormProps> = ({
	children,
	...props
}) => {
	const { bridgeAction } = useBridge();
	const { connectedChain } = useWalletProvider();

	const [buttonLabel, setButtonLabel] = useState<string>("Deposit");

	const processDepositRequest = useDepositRequest();

	const processWithdrawRequest = useWithdrawRequest();

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

			{bridgeAction === "Withdraw" && <BridgeWithdrawAdvanced />}

			<div css={styles.formSubmit}>
				<SubmitButton
					forceRequireMetaMask={true}
					disabled={status === "Inactive" || connectedChain !== "Ethereum"}
				>
					{buttonLabel}
				</SubmitButton>

				{status === "Inactive" && (
					<div css={styles.formNote}>
						{bridgeAction} is temporarily deactivated, please try again later.
					</div>
				)}

				{connectedChain !== "Ethereum" && (
					<div css={styles.formNote}>
						Please connect to {ETHEREUM_NETWORK.ChainName} in MetaMask.
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
		margin: 1em auto 0;
		color: ${palette.grey["800"]};
		width: 240px;
	`,
};
