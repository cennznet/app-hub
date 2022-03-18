import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { FC, useCallback, useEffect, useState } from "react";
import SubmitButton from "@/components/shared/SubmitButton";
import { Theme } from "@mui/material";
import { usePool } from "@/providers/PoolProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import {
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

	const onFormSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			if (!api) return;
			setProgressStatus();

			const extrinsic =
				poolAction === "Remove"
					? getRemoveLiquidityExtrinsic(
							api,
							userInfo,
							tradeAsset,
							Number(trValue),
							coreAsset,
							Number(crValue),
							Number(slippage)
					  )
					: getAddLiquidityExtrinsic(
							api,
							exchangeInfo,
							tradeAsset,
							Number(trValue),
							coreAsset,
							Number(crValue),
							Number(slippage)
					  );

			let status: UnwrapPromise<ReturnType<typeof signAndSendTx>>;
			try {
				status = await signAndSendTx(
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
			api,
			setProgressStatus,
			poolAction,
			tradeAsset,
			trValue,
			coreAsset,
			crValue,
			slippage,
			exchangeInfo,
			setTxStatus,
			setSuccessStatus,
			setTrValue,
			updateBalances,
			updatePoolUserInfo,
			updateExchangeRate,
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
