import { FC, useCallback } from "react";
import { css } from "@emotion/react";
import { IntrinsicElements } from "@/types";
import SubmitButton from "@/components/shared/SubmitButton";
import { Theme } from "@mui/material";
import { useStake } from "@/providers/StakeProvider";

interface StakeFormProps {}

const StakeForm: FC<IntrinsicElements["form"] & StakeFormProps> = ({
	children,
	...props
}) => {
	const { stakeAsset, stakeAction } = useStake();

	const onFormSubmit = useCallback(async (event) => {
		event.preventDefault();
	}, []);

	return (
		<form {...props} css={styles.root} onSubmit={onFormSubmit}>
			{children}

			<div css={styles.formSubmit}>
				<SubmitButton requireCENNZnet requireMetaMask={false}>
					{stakeAction} {stakeAsset.symbol}
				</SubmitButton>
			</div>
		</form>
	);
};

export default StakeForm;

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
