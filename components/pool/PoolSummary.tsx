import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { PoolSummary } from "../../types";
import { usePool } from "../../providers/PoolProvider";

interface FomattedBalances {
	userTradeAsset: string;
	userCoreAsset: string;
	poolTradeAsset: string;
	poolCoreAsset: string;
}

const PoolSummary: React.FC<{ poolSummaryProps: PoolSummary }> = ({
	poolSummaryProps,
}) => {
	const { tradeAsset, poolLiquidity } = poolSummaryProps;
	const { coreAsset, estimatedFee, userPoolShare } = usePool();
	const [loading, setLoading] = useState(true);
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

		setTimeout(() => setLoading(false), 1000);
	}, [coreAsset, tradeAsset, userPoolShare, poolLiquidity]);

	// if (loading)
	// 	return (
	// <Box sx={{ alignContent: "center", display: "flex" }}>
	// 	<CircularProgress sx={{ margin: "40px auto" }} />
	// </Box>
	// 	);
	// else
	return (
		<Box
			sx={{
				backgroundColor: userPoolShare ? "#F5ECFF" : null,
				width: "468px",
				height: "100px",
			}}
		>
			{loading ? (
				<Box sx={{ alignContent: "center", display: "flex" }}>
					<CircularProgress sx={{ margin: "30px auto" }} />
				</Box>
			) : (
				<Box sx={{ m: "2% auto 2%" }}>
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
									{formattedBalances.userTradeAsset} {tradeAsset.symbol} +&nbsp;
									{formattedBalances.userCoreAsset} {coreAsset.symbol}
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
								{estimatedFee.asString(coreAsset.decimals)} {coreAsset.symbol}
							</Typography>
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
};

export default PoolSummary;
