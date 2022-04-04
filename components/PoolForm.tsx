import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { FC, useCallback, useEffect, useState, useMemo } from "react";
import SubmitButton from "@/components/shared/SubmitButton";
import { Theme } from "@mui/material";
import { usePool } from "@/providers/PoolProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import {
	Balance,
	getAddLiquidityExtrinsic,
	getRemoveLiquidityExtrinsic,
	signAndSendTx2,
} from "@/utils";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";

interface PoolFormProps {}

const PoolForm: FC<IntrinsicElements["form"] & PoolFormProps> = ({
	children,
	...props
}) => {
	const { api } = useCENNZApi();
	const [buttonLabel, setButtonLabel] = useState<string>("Add to Pool");
	const {
		poolAction,
		setTxIdle,
		setTxPending,
		setTxSuccess,
		setTxFailure,

		slippage,

		tradeAsset,
		tradeInput: { value: trValue, setValue: setTrValue },
		coreAsset,
		coreInput: { value: crValue },

		exchangeInfo,

		updatePoolUserInfo,
		updateExchangeRate,
	} = usePool();

	const { selectedAccount, wallet, updateBalances } = useCENNZWallet();

	useEffect(() => {
		if (poolAction === "Add") return setButtonLabel("Add to Pool");
		if (poolAction === "Remove") return setButtonLabel("Withdraw from Pool");
	}, [poolAction]);

	const extrinsic = useMemo(() => {
		if (!api || !exchangeInfo) return;

		if (poolAction === "Remove") {
			return getRemoveLiquidityExtrinsic(
				api,
				exchangeInfo,
				tradeAsset,
				Balance.fromInput(trValue, tradeAsset),
				Balance.fromInput(crValue, coreAsset),
				Number(slippage)
			);
		}

		return getAddLiquidityExtrinsic(
			api,
			exchangeInfo,
			tradeAsset.assetId,
			Balance.fromInput(trValue, tradeAsset),
			Balance.fromInput(crValue, coreAsset),
			Number(slippage)
		);
	}, [
		api,
		coreAsset,
		crValue,
		exchangeInfo,
		poolAction,
		slippage,
		trValue,
		tradeAsset,
	]);

	const onFormSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			if (!extrinsic || !api) return;

			try {
				setTxPending();
				const tx = await signAndSendTx2(
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
					const event = tx.findEvent(
						result,
						"cennzx",
						poolAction === "Remove" ? "RemoveLiquidity" : "AddLiquidity"
					);

					const coreValue = Balance.fromCodec(event.data[1], coreAsset);
					const tradeValue = Balance.fromCodec(event.data[3], tradeAsset);

					setTrValue("");
					updateBalances();
					updatePoolUserInfo();
					updateExchangeRate();
					setTxSuccess({
						coreValue,
						tradeValue,
						txHashLink: tx.getHashLink(),
					});
				});
			} catch (error) {
				console.info(error);
				return setTxFailure({ errorCode: error?.code as string });
			}
		},
		[
			extrinsic,
			setTxIdle,
			setTxPending,
			setTxSuccess,
			setTxFailure,
			setTrValue,
			updateBalances,
			updatePoolUserInfo,
			updateExchangeRate,
			api,
			selectedAccount?.address,
			wallet?.signer,
			coreAsset,
			tradeAsset,
			poolAction,
		]
	);

	return (
		<form {...props} css={styles.root} onSubmit={onFormSubmit}>
			{children}

			<div css={styles.formSubmit}>
				<SubmitButton requireCENNZnet={true} requireMetaMask={false}>
					{buttonLabel}
				</SubmitButton>
			</div>
		</form>
	);
};

export default PoolForm;

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
