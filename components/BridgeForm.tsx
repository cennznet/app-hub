import { IntrinsicElements } from "@/types";
import { FC, useCallback, useEffect, useState } from "react";
import SubmitButton from "@/components/shared/SubmitButton";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useBridge } from "@/providers/BridgeProvider";
import useBridgeStatus from "@/hooks/useBridgeStatus";
import HistoricalWithdrawal from "@/components/HistoricalWithdrawal";
import {
	useDepositRequest,
	useHistoricalWithdrawRequest,
	useWithdrawRequest,
} from "@/hooks";

interface BridgeFormProps {}

const BridgeForm: FC<IntrinsicElements["form"] & BridgeFormProps> = ({
	children,
	...props
}) => {
	const { bridgeAction } = useBridge();
	const [buttonLabel, setButtonLabel] = useState<string>("Deposit");
	const [advancedExpanded, setAdvancedExpanded] = useState<boolean>(false);

	const processDepositRequest = useDepositRequest();

	const processWithdrawRequest = useWithdrawRequest();

	const processHistoricalWithdrawRequest = useHistoricalWithdrawRequest();

	const onFormSubmit = useCallback(
		async (event) => {
			event.preventDefault();
			if (bridgeAction === "Deposit") return processDepositRequest();
			if (bridgeAction === "Withdraw") {
				if (advancedExpanded) return processHistoricalWithdrawRequest();
				return processWithdrawRequest();
			}
		},
		[
			bridgeAction,
			processDepositRequest,
			processWithdrawRequest,
			processHistoricalWithdrawRequest,
			advancedExpanded,
		]
	);

	const status = useBridgeStatus();

	useEffect(() => {
		if (bridgeAction === "Deposit") return setButtonLabel("Deposit");
		if (bridgeAction === "Withdraw") return setButtonLabel("Withdraw");
	}, [bridgeAction]);

	return (
		<form {...props} css={styles.root} onSubmit={onFormSubmit}>
			{children}

			{bridgeAction === "Withdraw" && (
				<HistoricalWithdrawal
					expanded={advancedExpanded}
					setExpanded={setAdvancedExpanded}
				/>
			)}

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
		margin: 1em auto 0;
		color: ${palette.grey["800"]};
		width: 240px;
	`,
};
