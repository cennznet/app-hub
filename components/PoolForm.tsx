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
	signAndSendTx,
} from "@/utils";
import { UnwrapPromise } from "@/types";
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
		setTxStatus,
		setSuccessStatus,
		setProgressStatus,
		setFailStatus,

		slippage,

		tradeAsset,
		tradeValue: { value: trValue, setValue: setTrValue },
		coreAsset,
		coreValue: { value: crValue },

		exchangeInfo,
		userInfo,

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
			setProgressStatus();

			let status: UnwrapPromise<ReturnType<typeof signAndSendTx>>;
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
			setTrValue("");
			updateBalances();
			updatePoolUserInfo();
			updateExchangeRate();
		},
		[
			extrinsic,
			setProgressStatus,
			setTxStatus,
			setSuccessStatus,
			setTrValue,
			updateBalances,
			updatePoolUserInfo,
			updateExchangeRate,
			api,
			selectedAccount?.address,
			wallet?.signer,
			setFailStatus,
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
