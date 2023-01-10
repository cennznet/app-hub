import { FC, useCallback } from "react";
import { css } from "@emotion/react";
import { IntrinsicElements } from "@/libs/types";
import SubmitButton from "@/libs/components/shared/SubmitButton";
import { Theme } from "@mui/material";
import { useStake } from "@/libs/providers/StakeProvider";
import { useCENNZWallet } from "@/libs/providers/CENNZWalletProvider";
import { signAndSendTx } from "@/libs/utils";

interface StakeFormProps {}

const StakeForm: FC<IntrinsicElements["form"] & StakeFormProps> = ({
	children,
	...props
}) => {
	const { wallet, selectedAccount } = useCENNZWallet();
	const { stakingAsset, stakeAction, extrinsic } = useStake();
	const signer = wallet?.signer;

	const onFormSubmit = useCallback(
		async (event) => {
			event.preventDefault();
			if (!extrinsic || !selectedAccount || !signer) return;

			await signAndSendTx(extrinsic, selectedAccount.address, signer);
		},
		[extrinsic, selectedAccount, signer]
	);

	return (
		<form {...props} css={styles.root} onSubmit={onFormSubmit}>
			{children}

			<div css={styles.formSubmit}>
				<SubmitButton>
					{stakeAction} {stakingAsset?.symbol}
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
