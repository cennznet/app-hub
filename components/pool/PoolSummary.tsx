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

		setFormattedBalances({
			userTradeAsset: userPoolShare?.assetBalance.asString(
				tradeAsset?.decimals
			),
			userCoreAsset: userPoolShare?.coreAssetBalance.asString(
				coreAsset?.decimals
			),
			poolTradeAsset: formatBalance(Number(poolLiquidity?.tradeAsset)),
			poolCoreAsset: formatBalance(Number(poolLiquidity?.coreAsset)),
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
					{!!userPoolShare && (
						<PoolSummaryBox>
							<PoolSummaryBoldText>Your Liquidity:</PoolSummaryBoldText>
							&nbsp;
							{!!formattedBalances && (
								<PoolSummaryText
									sx={{
										fontSize: "16px",
										lineHeight: "175%",
									}}
								>
									{formattedBalances.userTradeAsset} {tradeAsset?.symbol}{" "}
									+&nbsp;
									{formattedBalances.userCoreAsset} {coreAsset?.symbol}
								</PoolSummaryText>
							)}
						</PoolSummaryBox>
					)}
					{!!poolLiquidity && (
						<PoolSummaryBox>
							<PoolSummaryBoldText>Pool Liquidity:</PoolSummaryBoldText>
							&nbsp;
							<PoolSummaryText>
								{formattedBalances.poolTradeAsset} {tradeAsset.symbol} +&nbsp;
								{formattedBalances.poolCoreAsset} {coreAsset.symbol}
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
