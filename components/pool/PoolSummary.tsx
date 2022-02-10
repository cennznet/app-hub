import React from "react";
import { Box, Typography } from "@mui/material";
import { PoolSummary } from "../../types";
import { usePool } from "../../providers/PoolProvider";

const PoolSummary: React.FC<{ poolSummaryProps: PoolSummary }> = ({
	poolSummaryProps,
}) => {
	const { tradeAsset, poolLiquidity } = poolSummaryProps;
	const { coreAsset, estimatedFee, userPoolShare } = usePool();

	return (
		<Box>
			{!!userPoolShare && (
				<Typography>
					Your Liquidity:{" "}
					{userPoolShare.assetBalance.asString(tradeAsset.decimals)}{" "}
					{tradeAsset.symbol} +{" "}
					{userPoolShare.coreAssetBalance.asString(coreAsset.decimals)}{" "}
					{coreAsset.symbol}
				</Typography>
			)}
			{!!poolLiquidity && (
				<Typography>
					Pool Liquidity: {poolLiquidity.tradeAsset} {tradeAsset.symbol} +{" "}
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
