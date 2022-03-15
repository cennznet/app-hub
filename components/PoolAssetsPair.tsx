import { usePool } from "@/providers/PoolProvider";
import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { VFC, useMemo, useEffect } from "react";
import TokenInput from "@/components/shared/TokenInput";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import useAssetBalances from "@/hooks/useAssetBalances";
import { formatBalance } from "@/utils";
import { Theme } from "@mui/material";
import usePoolExchangeRate from "@/hooks/usePoolExchangeRate";

interface PoolAssetsPairProps {}

const PoolAssetsPair: VFC<IntrinsicElements["div"] & PoolAssetsPairProps> = (
	props
) => {
	const {
		poolAction,
		tradeAssets,
		tradeAsset,
		tradeToken,
		tradeValue,
		coreAsset,
		coreToken,
		coreValue,
	} = usePool();

	const { selectedAccount } = useCENNZWallet();
	const [poolBalance, cpayBalance] = useAssetBalances(tradeAsset, coreAsset);

	const onTradeAssetMaxRequest = useMemo(() => {
		if (!poolBalance) return;
		const setPoolValue = tradeValue.setValue;
		return () => setPoolValue(formatBalance(poolBalance));
	}, [poolBalance, tradeValue.setValue]);

	const onCoreAssetMaxRequest = useMemo(() => {
		if (!cpayBalance) return;
		const setCPAYValue = coreValue.setValue;
		return () => setCPAYValue(formatBalance(cpayBalance));
	}, [cpayBalance, coreValue.setValue]);

	const [exchangeRate] = usePoolExchangeRate();

	// Update coreAsset value by tradeAsset value
	useEffect(() => {
		if (!exchangeRate) return;
		const trValue = Number(tradeValue.value);
		const setCoreValue = coreValue.setValue;

		setCoreValue(formatBalance(trValue / exchangeRate));
	}, [tradeValue.value, coreValue.setValue, exchangeRate]);

	// Update tradeAsset value by coreAsset value
	useEffect(() => {
		if (!exchangeRate) return;
		const crValue = Number(coreValue.value);
		const setTradeValue = tradeValue.setValue;

		setTradeValue(formatBalance(crValue * exchangeRate));
	}, [coreValue.value, tradeValue.setValue, exchangeRate]);

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				<label htmlFor="tradeInput">Liquidity Asset</label>

				{poolAction === "Add" && (
					<div css={styles.formCopy}>
						<p>
							To keep the liquidity pool functional, deposits require an equal
							value of <strong>{tradeAsset.symbol}</strong> and{" "}
							<strong>{coreAsset.symbol}</strong> at the current exchange rate.
						</p>
						<p>
							By adding liquidity you will earn <strong>0.3%</strong> of all
							trades on this pair proportional to your share of the pool.
						</p>
					</div>
				)}

				{poolAction === "Remove" && (
					<div css={styles.formCopy}>
						<p>
							To keep the liquidity pool functional, withdrawals will return an
							equal value of <strong>{tradeAsset.symbol}</strong> and{" "}
							<strong>{coreAsset.symbol}</strong> at the current exchange rate.
						</p>
						<p>
							Accrued fees can be claimed at any time by withdrawing your
							liquidity.
						</p>
					</div>
				)}

				<TokenInput
					onMaxValueRequest={onTradeAssetMaxRequest}
					selectedTokenId={tradeToken.tokenId}
					onTokenChange={tradeToken.onTokenChange}
					value={tradeValue.value}
					onValueChange={tradeValue.onValueChange}
					tokens={tradeAssets}
					id="tradeInput"
					required
					scale={4}
					min={0.0001}
				/>

				{!!selectedAccount && (
					<div css={styles.tokenBalance}>
						Balance:{" "}
						<span>{formatBalance(poolBalance !== null ? poolBalance : 0)}</span>
					</div>
				)}
			</div>

			<div css={styles.formField}>
				<TokenInput
					onMaxValueRequest={onCoreAssetMaxRequest}
					selectedTokenId={coreToken.tokenId}
					onTokenChange={coreToken.onTokenChange}
					value={coreValue.value}
					onValueChange={coreValue.onValueChange}
					tokens={[coreAsset]}
					id="coreInput"
					required
					scale={4}
					min={0.0001}
				/>

				{!!selectedAccount && (
					<div css={styles.tokenBalance}>
						Balance:{" "}
						<span>{formatBalance(cpayBalance !== null ? cpayBalance : 0)}</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default PoolAssetsPair;

const styles = {
	root: css``,

	formField: ({ palette }: Theme) => css`
		margin-bottom: 1.5em;

		&:last-child {
			margin-bottom: 0;
		}

		label {
			font-weight: bold;
			font-size: 14px;
			text-transform: uppercase;
			margin-bottom: 0.5em;
			display: block;
			color: ${palette.primary.main};
		}
	`,

	tokenBalance: ({ palette }: Theme) => css`
		margin-top: 0.25em;
		font-weight: 500;
		color: ${palette.grey["700"]};

		span {
			font-family: "Roboto Mono", monospace;
			font-size: 14px;
			font-weight: bold;
		}
	`,

	formCopy: ({ palette }: Theme) => css`
		margin-bottom: 1.5em;
		font-size: 14px;
		p {
			margin-top: 0;
		}

		strong {
		}
	`,
};
