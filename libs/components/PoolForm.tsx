import {
	CENNZnetExtrinsic,
	IntrinsicElements,
	SubmittableExtrinsic,
} from "@/libs/types";
import { css } from "@emotion/react";
import { FC, useCallback, useEffect, useState, useMemo } from "react";
import { SubmitButton } from "@/libs/components";
import { Theme } from "@mui/material";
import { usePool } from "@/libs/providers/PoolProvider";
import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import {
	Balance,
	CENNZTransaction,
	getAddLiquidityExtrinsic,
	getRemoveLiquidityExtrinsic,
	signAndSendTx,
	signViaEthWallet,
} from "@/libs/utils";
import { useCENNZWallet } from "@/libs/providers/CENNZWalletProvider";
import { useWalletProvider } from "@/libs/providers/WalletProvider";
import { useMetaMaskWallet } from "@/libs/providers/MetaMaskWalletProvider";
import { useMetaMaskExtension } from "@/libs/providers/MetaMaskExtensionProvider";
import { useUpdateCENNZBalances } from "@/libs/hooks";

interface PoolFormProps {}

const PoolForm: FC<IntrinsicElements["form"] & PoolFormProps> = ({
	children,
	...props
}) => {
	const { api } = useCENNZApi();
	const { selectedWallet } = useWalletProvider();
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

	const { selectedAccount: cennzAccount, wallet } = useCENNZWallet();
	const { selectedAccount: metaMaskAccount } = useMetaMaskWallet();
	const { extension } = useMetaMaskExtension();

	const updateCENNZBalances = useUpdateCENNZBalances();

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
				let tx: CENNZTransaction;
				if (selectedWallet === "CENNZnet")
					tx = await signAndSendTx(
						extrinsic as SubmittableExtrinsic<"promise">,
						cennzAccount.address,
						wallet.signer
					);
				if (selectedWallet === "MetaMask")
					tx = await signViaEthWallet(
						api,
						metaMaskAccount.address,
						extrinsic as CENNZnetExtrinsic,
						extension
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
					updateCENNZBalances();
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
			updateCENNZBalances,
			updatePoolUserInfo,
			updateExchangeRate,
			api,
			cennzAccount?.address,
			metaMaskAccount?.address,
			wallet?.signer,
			coreAsset,
			tradeAsset,
			poolAction,
			selectedWallet,
			extension,
		]
	);

	return (
		<form {...props} css={styles.root} onSubmit={onFormSubmit}>
			{children}

			<div css={styles.formSubmit}>
				<SubmitButton>{buttonLabel}</SubmitButton>
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
