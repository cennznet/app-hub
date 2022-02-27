import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { PoolSummaryProps } from "@/types";
import { usePool } from "@/providers/PoolProvider";
import {
	PoolSummaryBox,
	PoolSummaryText,
	PoolSummaryBoldText,
} from "@/components/StyledComponents";
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
		<Box
			sx={{
				backgroundColor: "#F5ECFF",
				width: "468px",
				height: "auto",
			}}
		>
			{loading ? (
				<Box sx={{ alignContent: "center", display: "flex" }}>
					<CircularProgress sx={{ margin: "30px auto", color: "#6200EE" }} />
				</Box>
			) : (
				<Box sx={{ m: "4% auto 4%" }}>
					{!!exchangeRate && !!tradeAsset && (
						<PoolSummaryBox>
							<PoolSummaryBoldText>Exchange Rate:</PoolSummaryBoldText>
							&nbsp;
							<PoolSummaryText>
								1 {coreAsset?.symbol} = {exchangeRate} {tradeAsset?.symbol}
							</PoolSummaryText>
						</PoolSummaryBox>
					)}
					{!!poolLiquidity && (
						<PoolSummaryBox>
							<PoolSummaryBoldText>Pool Liquidity:</PoolSummaryBoldText>
							&nbsp;
							<PoolSummaryText>
								{formattedBalances.poolTradeAsset} {tradeAsset.symbol}
								{" + "}
								{formattedBalances.poolCoreAsset} {coreAsset.symbol}
							</PoolSummaryText>
						</PoolSummaryBox>
					)}
					{!!userPoolShare && (
						<PoolSummaryBox>
							<PoolSummaryBoldText>Your Liquidity:</PoolSummaryBoldText>
							&nbsp;
							{!!formattedBalances && (
								<PoolSummaryText>
									{formattedBalances.userTradeAsset} {tradeAsset?.symbol}
									{" + "}
									{formattedBalances.userCoreAsset} {coreAsset?.symbol}
								</PoolSummaryText>
							)}
						</PoolSummaryBox>
					)}
					{!!formattedBalances && (
						<PoolSummaryBox>
							<PoolSummaryBoldText>Your Pool Share:</PoolSummaryBoldText>
							&nbsp;
							<PoolSummaryText>
								{formattedBalances?.userPercentageShare}%
							</PoolSummaryText>
						</PoolSummaryBox>
					)}
					{!!estimatedFee && (
						<PoolSummaryBox>
							<PoolSummaryBoldText>Estimated Fee:</PoolSummaryBoldText>
							&nbsp;
							<PoolSummaryText>
								{estimatedFee.asString(coreAsset?.decimals)} {coreAsset?.symbol}
							</PoolSummaryText>
						</PoolSummaryBox>
					)}
				</Box>
			)}
		</Box>
	);
};

export default PoolSummary;
