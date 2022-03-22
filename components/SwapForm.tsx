import { IntrinsicElements } from "@/types";
import { FC, useCallback } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import SubmitButton from "@/components/shared/SubmitButton";
import { useSwap } from "@/providers/SwapProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { Balance, getBuyAssetExtrinsic, signAndSendTx } from "@/utils";

interface SwapFormProps {}

const SwapForm: FC<IntrinsicElements["form"] & SwapFormProps> = ({
	children,
	...props
}) => {
	const { api } = useCENNZApi();

	const {
		exchangeAsset,
		receiveAsset,
		exchangeValue: { value: exValue, setValue: setExValue },
		receiveValue: { value: reValue },
		slippage,
		setTxStatus,
		setSuccessStatus,
		setProgressStatus,
		setFailStatus,
	} = useSwap();
	const { selectedAccount, wallet, updateBalances } = useCENNZWallet();

	const onFormSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			if (!api) return;
			setProgressStatus();

			const extrinsic = getBuyAssetExtrinsic(
				api,
				exchangeAsset.assetId,
				Balance.fromInput(exValue, exchangeAsset),
				receiveAsset.assetId,
				Balance.fromInput(reValue, receiveAsset),
				Number(slippage)
			);

			let status: Awaited<ReturnType<typeof signAndSendTx>>;
			try {
				status = await signAndSendTx(
					api,
					extrinsic,
					selectedAccount.address,
					wallet.signer
				);
			} catch (error) {
				console.info(error);
				return setFailStatus(error?.code);
			}

			if (status === "cancelled") return setTxStatus(null);

			setSuccessStatus();
			setExValue("");
			updateBalances();
		},
		[
			api,
			exchangeAsset,
			receiveAsset,
			exValue,
			reValue,
			slippage,
			selectedAccount?.address,
			wallet?.signer,
			setTxStatus,
			updateBalances,
			setExValue,
			setSuccessStatus,
			setFailStatus,
			setProgressStatus,
		]
	);

	return (
		<form {...props} css={styles.root} onSubmit={onFormSubmit}>
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
		border-top: 1px solid ${palette.divider};
		padding-top: 2em;
		margin: 2em -2.5em 0;
	`,
};
