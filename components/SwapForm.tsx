import { IntrinsicElements } from "@/types";
import { FC, useCallback } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import SubmitButton from "@/components/shared/SubmitButton";
import { useSwap } from "@/providers/SwapProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { getBuyAssetExtrinsic, signAndSendTx, formatBalance } from "@/utils";
import { UnwrapPromise } from "@/types";

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
	} = useSwap();
	const { selectedAccount, wallet, updateBalances } = useCENNZWallet();

	const onFormSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			if (!api) return;

			const extrinsic = getBuyAssetExtrinsic(
				api,
				exchangeAsset,
				Number(exValue),
				receiveAsset,
				Number(reValue),
				Number(slippage)
			);

			setTxStatus({
				status: "in-progress",
				message: "Please wait and sign the transaction when prompted...",
			});

			let status: UnwrapPromise<ReturnType<typeof signAndSendTx>>;
			try {
				status = await signAndSendTx(
					extrinsic,
					selectedAccount.address,
					wallet.signer
				);
			} catch (error) {
				console.info(error);
				return setTxStatus({
					status: "fail",
					message: `An error${
						error?.code ? ` (#${error.code})` : ""
					} has occurred while processing your transaction`,
				});
			}

			if (status === "cancelled") setTxStatus(null);

			setTxStatus({
				status: "success",
				message: (
					<div>
						You successfully swapped{" "}
						<pre css={styles.highlightText}>
							{formatBalance(Number(exValue))} {exchangeAsset.symbol}
						</pre>{" "}
						for{" "}
						<pre css={styles.highlightText}>
							{formatBalance(Number(reValue))} {receiveAsset.symbol}
						</pre>
					</div>
				),
			});

			setExValue("");
			await updateBalances();
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

	highlightText: ({ palette }: Theme) => css`
		color: ${palette.text.highlight};
	`,
};
