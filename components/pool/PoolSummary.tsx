import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { CircularProgress } from "@mui/material";
import { PoolSummaryProps } from "@/types";
import { usePool } from "@/providers/PoolCurrentProvider";
import { formatBalance } from "@/utils";

interface FomattedBalances {
	userTradeAsset: string;
	userCoreAsset: string;
	poolTradeAsset: string;
	poolCoreAsset: string;
	userPercentageShare: string;
}

const PoolSummary: React.FC<{ poolSummaryProps: PoolSummaryProps }> = ({
	poolSummaryProps,
}) => {
	const { coreAsset, estimatedFee, userPoolShare } = usePool();
	const { tradeAsset, poolLiquidity, exchangeRate }: any = poolSummaryProps;
	const [loading, setLoading] = useState<boolean>(true);
	const [formattedBalances, setFormattedBalances] =
		useState<FomattedBalances>(null);

	useEffect(() => {
		setLoading(true);
		if (!userPoolShare || !poolLiquidity || !tradeAsset || !coreAsset) return;

		const userTradeAsset = userPoolShare.assetBalance.asString(
			tradeAsset.decimals
		);
		const userCoreAsset = userPoolShare.coreAssetBalance.asString(
			coreAsset.decimals
		);

		const userPercentageShare =
			Number(userCoreAsset) / Number(poolLiquidity.coreAsset);

		setFormattedBalances({
			userTradeAsset: formatBalance(Number(userTradeAsset)),
			userCoreAsset: formatBalance(Number(userCoreAsset)),
			poolTradeAsset: formatBalance(Number(poolLiquidity.tradeAsset)),
			poolCoreAsset: formatBalance(Number(poolLiquidity.coreAsset)),
			userPercentageShare: formatBalance(userPercentageShare * 100),
		});

		setTimeout(() => setLoading(false), 2000);
	}, [coreAsset, tradeAsset, userPoolShare, poolLiquidity]);

	return (
		<div css={styles.summaryBox}>
			{loading ? (
				<div css={styles.loadingBox}>
					<CircularProgress css={styles.loading} />
				</div>
			) : (
				<div css={styles.summary}>
					{!!exchangeRate && !!tradeAsset && (
						<div css={styles.summaryTextWrapper}>
							<div css={styles.summaryBoldText}>Exchange Rate:</div>
							&nbsp;
							<div css={styles.summaryText}>
								1 {coreAsset?.symbol} = {exchangeRate} {tradeAsset?.symbol}
							</div>
						</div>
					)}
					{!!poolLiquidity && (
						<div css={styles.summaryTextWrapper}>
							<div css={styles.summaryBoldText}>Pool Liquidity:</div>
							&nbsp;
							<div css={styles.summaryText}>
								{formattedBalances.poolTradeAsset} {tradeAsset.symbol}
								{" + "}
								{formattedBalances.poolCoreAsset} {coreAsset.symbol}
							</div>
						</div>
					)}
					{!!userPoolShare && (
						<div css={styles.summaryTextWrapper}>
							<div css={styles.summaryBoldText}>Your Liquidity:</div>
							&nbsp;
							{!!formattedBalances && (
								<div css={styles.summaryText}>
									{formattedBalances.userTradeAsset} {tradeAsset?.symbol}
									{" + "}
									{formattedBalances.userCoreAsset} {coreAsset?.symbol}
								</div>
							)}
						</div>
					)}
					{!!formattedBalances && (
						<div css={styles.summaryTextWrapper}>
							<div css={styles.summaryBoldText}>Your Pool Share:</div>
							&nbsp;
							<div css={styles.summaryText}>
								{formattedBalances?.userPercentageShare}%
							</div>
						</div>
					)}
					{!!estimatedFee && (
						<div css={styles.summaryTextWrapper}>
							<div css={styles.summaryBoldText}>Estimated Fee:</div>
							&nbsp;
							<div css={styles.summaryText}>
								{estimatedFee.asString(coreAsset?.decimals)} {coreAsset?.symbol}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default PoolSummary;

export const styles = {
	summaryBox: css`
		background-color: #f5ecff;
		width: 468px;
		height: auto;
	`,
	summary: css`
		margin: 4% auto 4%;
	`,
	loadingBox: css`
		display: flex;
		align-content: center;
	`,
	loading: css`
		margin: 30px auto;
		color: #6200ee;
	`,
	summaryTextWrapper: css`
		display: flex;
		flex-direction: row;
		margin-left: 30px;
	`,
	summaryText: css`
		font-size: 16px;
		line-height: 175%;
	`,
	summaryBoldText: css`
		font-size: 16px;
		line-height: 175%;
		font-weight: bold;
		color: #6200ee;
	`,
};
