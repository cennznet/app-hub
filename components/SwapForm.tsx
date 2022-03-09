import { IntrinsicElements } from "@/types";
import { FC } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import SubmitButton from "@/components/shared/SubmitButton";

interface SwapFormProps {}

const SwapForm: FC<IntrinsicElements["form"] & SwapFormProps> = ({
	children,
	...props
}) => {
	return (
		<form {...props} css={styles.root}>
			{children}

			<div css={styles.formSubmit}>
				<SubmitButton requireCENNZnet={true} requireMetaMask={false}>
					Swap
				</SubmitButton>
			</div>
		</form>
	);
};

export default SwapForm;

const styles = {
	root: css`
		width: 100%;
		position: relative;
	`,

	formSubmit: ({ palette }: Theme) => css`
		text-align: center;
		border-top: 1px solid ${palette.text.disabled};
		padding-top: 2em;
		margin-top: 2em;
	`,
};
