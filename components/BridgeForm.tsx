import { IntrinsicElements } from "@/types";
import { FC, useCallback, useEffect, useState } from "react";
import SubmitButton from "@/components/shared/SubmitButton";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useBridge } from "@/providers/BridgeProvider";
import useBridgeStatus from "@/hooks/useBridgeStatus";

interface BridgeFormProps {}

const BridgeForm: FC<IntrinsicElements["form"] & BridgeFormProps> = ({
	children,
	...props
}) => {
	const { bridgeAction } = useBridge();
	const [buttonLabel, setButtonLabel] = useState<string>("Deposit");
	const onFormSubmit = useCallback(async (event) => {
		event.preventDefault();
		console.log("onFormSubmit");
	}, []);

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
