import { IntrinsicElements } from "@/types";
import { FC, useCallback, useEffect } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import SubmitButton from "@/components/shared/SubmitButton";
import { useSwap } from "@/providers/SwapProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { Balance, getSellAssetExtrinsic, signAndSendTx } from "@/utils";

interface SwapFormProps {}

const SwapForm: FC<IntrinsicElements["form"] & SwapFormProps> = ({
	children,
	...props
}) => {
	const { api } = useCENNZApi();

	const {
		exchangeAsset,
		receiveAsset,
		exchangeInput: { value: exValue, setValue: setExValue },
		receiveInput: { value: reValue },
		slippage,
		setTxIdle,
		setTxPending,
		setTxSuccess,
		setTxFailure,
	} = useSwap();
	const { selectedAccount, wallet, updateBalances } = useCENNZWallet();

	const onFormSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			if (!api) return;

			try {
				setTxPending();
				const extrinsic = getSellAssetExtrinsic(
					api,
					exchangeAsset.assetId,
					Balance.fromInput(exValue, exchangeAsset),
					receiveAsset.assetId,
					Balance.fromInput(reValue, receiveAsset),
					Number(slippage)
				);

				const tx = await signAndSendTx(
					extrinsic,
					selectedAccount.address,
					wallet.signer
				);

				tx.on("txCancelled", () => setTxIdle());

				tx.on("txHashed", () => {
					setTxPending({
						txHashLink: tx.getHashLink(),
					});
				});

				tx.on("txFailed", (result) =>
					setTxFailure({
						errorCode: tx.decodeError(result),
						txHashLink: tx.getHashLink(),
					})
				);

				tx.on("txSucceeded", (result) => {
					const event = tx.findEvent(result, "cennzx", "AssetSold");
					const exchangeValue = Balance.fromCodec(event.data[3], exchangeAsset);
					const receiveValue = Balance.fromCodec(event.data[4], receiveAsset);

					updateBalances();
					setExValue("");
					setTxSuccess({
						exchangeValue,
						receiveValue,
						txHashLink: tx.getHashLink(),
					});
				});
			} catch (error) {
				console.info(error);
				return setTxFailure({ errorCode: error?.code as string });
			}
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
			updateBalances,
			setExValue,
			setTxFailure,
			setTxPending,
			setTxSuccess,
			setTxIdle,
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
