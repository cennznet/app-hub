import { usePool } from "@/providers/PoolProvider";
import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { VFC, useMemo } from "react";
import TokenInput from "@/components/shared/TokenInput";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import useAssetBalances from "@/hooks/useAssetBalances";
import { formatBalance } from "@/utils";
import { Theme } from "@mui/material";

interface PoolAssetsPairProps {}

const PoolAssetsPair: VFC<IntrinsicElements["div"] & PoolAssetsPairProps> = (
	props
) => {
	const {
		poolAction,
		poolAssets,
		poolAsset,
		poolToken,
		poolValue,
		cpayAsset,
		cpayToken,
		cpayValue,
	} = usePool();

	const { selectedAccount } = useCENNZWallet();
	const [poolBalance, cpayBalance] = useAssetBalances(poolAsset, cpayAsset);

	const onPoolMaxRequest = useMemo(() => {
		if (!poolBalance) return;
		const setPoolValue = poolValue.setValue;
		return () => setPoolValue(formatBalance(poolBalance));
	}, [poolBalance, poolValue.setValue]);

	const onCPAYMaxRequest = useMemo(() => {
		if (!cpayBalance) return;
		const setCPAYValue = cpayValue.setValue;
		return () => setCPAYValue(formatBalance(cpayBalance));
	}, [cpayBalance, cpayValue.setValue]);

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				<label htmlFor="poolInput">Liquidity Asset</label>

				{poolAction === "Add" && (
					<div css={styles.formCopy}>
						<p>
							To keep the liquidity pool functional, deposits require an equal
							value of <strong>{poolAsset.symbol}</strong> and{" "}
							<strong>{cpayAsset.symbol}</strong> at the current exchange rate.
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
							equal value of <strong>{poolAsset.symbol}</strong> and{" "}
							<strong>{cpayAsset.symbol}</strong> at the current exchange rate.
						</p>
						<p>
							Accrued fees can be claimed at any time by withdrawing your
							liquidity.
						</p>
					</div>
				)}

				<TokenInput
					onMaxValueRequest={onPoolMaxRequest}
					selectedTokenId={poolToken.tokenId}
					onTokenChange={poolToken.onTokenChange}
					value={poolValue.value}
					onValueChange={poolValue.onValueChange}
					tokens={poolAssets}
					id="poolInput"
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
					onMaxValueRequest={onCPAYMaxRequest}
					selectedTokenId={cpayToken.tokenId}
					onTokenChange={cpayToken.onTokenChange}
					value={cpayValue.value}
					onValueChange={cpayValue.onValueChange}
					tokens={[cpayAsset]}
					id="cpayInput"
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
		margin-bottom: 1em;

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
		margin-top: 0.5em;
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
			color: ${palette.primary.main};
		}
	`,
};
