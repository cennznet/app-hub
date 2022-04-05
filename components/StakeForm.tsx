import { FC, useCallback } from "react";
import { css } from "@emotion/react";
import { IntrinsicElements } from "@/types";
import SubmitButton from "@/components/shared/SubmitButton";
import { Theme } from "@mui/material";
import { useStake } from "@/providers/StakeProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { signAndSendTx } from "@/utils";

interface StakeFormProps {}

const StakeForm: FC<IntrinsicElements["form"] & StakeFormProps> = ({
	children,
	...props
}) => {
	const { api } = useCENNZApi();
	const { wallet, selectedAccount } = useCENNZWallet();
	const { stakingAsset, stakeAction, extrinsic } = useStake();
	const signer = wallet?.signer;

	const onFormSubmit = useCallback(
		async (event) => {
			event.preventDefault();
			if (!api || !extrinsic || !selectedAccount || !signer) return;

			await signAndSendTx(api, extrinsic, selectedAccount.address, signer);
		},
		[api, extrinsic, selectedAccount, signer]
	);

	return (
		<form {...props} css={styles.root} onSubmit={onFormSubmit}>
			{children}

			<div css={styles.formSubmit}>
				<SubmitButton requireCENNZnet requireMetaMask={false}>
					{stakeAction} {stakingAsset.symbol}
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
