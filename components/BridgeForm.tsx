import { IntrinsicElements } from "@/types";
import { FC, useState } from "react";
import SubmitButton from "@/components/shared/SubmitButton";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";

interface BridgeFormProps {}

const BridgeForm: FC<IntrinsicElements["form"] & BridgeFormProps> = ({
	children,
	...props
}) => {
	const [buttonLabel, setButtonLabel] = useState<string>("Deposit");

	return (
		<form {...props} css={styles.root}>
			{children}

			<div css={styles.formSubmit}>
				<SubmitButton requireCENNZnet={true} requireMetaMask={true}>
					{buttonLabel}
				</SubmitButton>
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
};
