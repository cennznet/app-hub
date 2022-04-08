import { FC, useCallback } from "react";
import { css } from "@emotion/react";
import { IntrinsicElements } from "@/types";
import SubmitButton from "@/components/shared/SubmitButton";
import { Theme } from "@mui/material";
import { useStake } from "@/providers/StakeProvider";
import { STAKE_ACTIONS } from "@/constants";
import { useStakeActionRequest } from "@/hooks";

interface StakeFormProps {}

const StakeForm: FC<IntrinsicElements["form"] & StakeFormProps> = ({
	children,
	...props
}) => {
	const { stakeAction } = useStake();

	const processStakeActionRequest = useStakeActionRequest();

	const onFormSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			if (!stakeAction) return;
			await processStakeActionRequest();
		},
		[stakeAction, processStakeActionRequest]
	);

	return (
		<form {...props} css={styles.root} onSubmit={onFormSubmit}>
			<div css={styles.children}>{children}</div>

			<div css={styles.formSubmit}>
				<SubmitButton requireCENNZnet requireMetaMask={false}>
					{STAKE_ACTIONS[stakeAction]}
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

	children: css`
		min-height: 25em;
	`,

	formSubmit: ({ palette }: Theme) => css`
		text-align: center;
		border-top: 1px solid ${palette.divider};
		padding-top: 2em;
		margin: 2em -2.5em 0;
	`,
};
