import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { PoolSummaryProps } from "../../types";
import { usePool } from "../../providers/PoolProvider";

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
			poolTradeAsset: Number(poolLiquidity?.tradeAsset).toFixed(4),
			poolCoreAsset: Number(poolLiquidity?.coreAsset).toFixed(4),
		});

		setTimeout(() => setLoading(false), 2000);
	}, [coreAsset, tradeAsset, userPoolShare, poolLiquidity]);

	return (
		<Box
			sx={{
				backgroundColor: userPoolShare ? "#F5ECFF" : null,
				width: "468px",
				height: "auto",
			}}
		>
			{loading ? (
				<Box sx={{ alignContent: "center", display: "flex" }}>
					<CircularProgress sx={{ margin: "30px auto", color: "#6200EE" }} />
				</Box>
			) : (
				<Box sx={{ m: "2% auto 2%" }}>
					{!!exchangeRate && !!tradeAsset && (
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								ml: "8%",
							}}
						>
							<Typography
								sx={{
									color: "#6200EE",
									fontSize: "16px",
									lineHeight: "175%",
									fontWeight: "bold",
								}}
							>
								Exchange Rate:
							</Typography>
							&nbsp;
							<Typography
								sx={{
									fontSize: "16px",
									lineHeight: "175%",
								}}
							>
								1 {coreAsset?.symbol} = {exchangeRate} {tradeAsset?.symbol}
							</Typography>
						</Box>
					)}
					{!!userPoolShare && (
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								ml: "8%",
							}}
						>
							<Typography
								sx={{
									color: "#6200EE",
									fontSize: "16px",
									lineHeight: "175%",
									fontWeight: "bold",
								}}
							>
								Your Liquidity:
							</Typography>
							&nbsp;
							{!!formattedBalances && (
								<Typography
									sx={{
										fontSize: "16px",
										lineHeight: "175%",
									}}
								>
									{formattedBalances.userTradeAsset} {tradeAsset?.symbol}{" "}
									+&nbsp;
									{formattedBalances.userCoreAsset} {coreAsset?.symbol}
								</Typography>
							)}
						</Box>
					)}
					{!!poolLiquidity && (
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								ml: "8%",
							}}
						>
							<Typography
								sx={{
									color: "#6200EE",
									fontSize: "16px",
									lineHeight: "175%",
									fontWeight: "bold",
								}}
							>
								Pool Liquidity:
							</Typography>
							&nbsp;
							<Typography
								sx={{
									fontSize: "16px",
									lineHeight: "175%",
								}}
							>
								{formattedBalances.poolTradeAsset} {tradeAsset.symbol} +&nbsp;
								{formattedBalances.poolCoreAsset} {coreAsset.symbol}
							</Typography>
						</Box>
					)}
					{!!estimatedFee && (
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								ml: "8%",
							}}
						>
							<Typography
								sx={{
									color: "#6200EE",
									fontSize: "16px",
									lineHeight: "175%",
									fontWeight: "bold",
								}}
							>
								Estimated Fee:
							</Typography>
							&nbsp;
							<Typography
								sx={{
									fontSize: "16px",
									lineHeight: "175%",
								}}
							>
								{estimatedFee.asString(coreAsset?.decimals)} {coreAsset?.symbol}
							</Typography>
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
};

export default PoolSummary;
