import React from "react";
import { Box, Typography } from "@mui/material";
import { PoolSummary } from "../../types";

const PoolSummary: React.FC<{ poolSummaryProps: PoolSummary }> = ({
	poolSummaryProps,
}) => {
	const { coreAsset, poolAsset, userPoolShare, poolLiquidity, estimatedFee } =
		poolSummaryProps;

	return (
		<Box>
			{!!userPoolShare && (
				<Typography>
					Your Liquidity:{" "}
					{userPoolShare.assetBalance.asString(poolAsset.decimals)}{" "}
					{poolAsset.symbol} +{" "}
					{userPoolShare.coreAssetBalance.asString(coreAsset.decimals)}{" "}
					{coreAsset.symbol}
				</Typography>
			)}
			{!!poolLiquidity && (
				<Typography>
					Pool Liquidity: {poolLiquidity.poolAsset} {poolAsset.symbol} +{" "}
					{poolLiquidity.coreAsset} {coreAsset.symbol}
				</Typography>
			)}
			{!!estimatedFee && (
				<Typography>
					Estimated Fee: {estimatedFee.asString(coreAsset.decimals)}{" "}
					{coreAsset.symbol}
				</Typography>
			)}
		</Box>
	);
};

export default PoolSummary;
