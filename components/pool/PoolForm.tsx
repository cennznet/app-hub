import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Box, Button, TextField } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Heading, SmallText } from "../../theme/StyledComponents";
import TokenPicker from "../../components/shared/TokenPicker";
import { AssetInfo, PoolValues } from "../../types";
import { useWallet } from "../../providers/SupportedWalletProvider";
import { PoolAction, usePool } from "../../providers/PoolProvider";
import { Amount } from "../../utils/Amount";
import PoolSummary from "./PoolSummary";

const ROUND_UP = 1;

const PoolForm: React.FC<{}> = () => {
	const [poolAction, setPoolAction] = useState<string>(PoolAction.ADD);
	const [poolAsset, setPoolAsset] = useState<AssetInfo>(null);
	const [poolAssetAmount, setPoolAssetAmount] = useState<number | string>();
	const [coreAmount, setCoreAmount] = useState<number | string>(0);
	const [poolLiquidity, setPoolLiquidity] = useState<PoolValues>();
	const [userBalances, setUserBalances] = useState<PoolValues>();
	const { balances } = useWallet();
	const {
		coreAsset,
		estimatedFee,
		exchangePool,
		updateExchangePool,
		defineExtrinsic,
		getUserPoolShare,
		userPoolShare,
		sendExtrinsic,
	} = usePool();

	const poolSummaryProps = useMemo(
		() => ({
			coreAsset,
			poolAsset,
			userPoolShare,
			poolLiquidity,
			estimatedFee,
		}),
		[coreAsset, poolAsset, userPoolShare, poolLiquidity, estimatedFee]
	);

	//get user and pool balances
	useEffect(() => {
		if (!balances || !poolAsset || !coreAsset) return;
		updateExchangePool(poolAsset);
		getUserPoolShare(poolAsset);

		const userPoolToken = balances.find(
			(asset) => asset.symbol === poolAsset.symbol
		);
		const userCore = balances.find(
			(asset) => asset.symbol === coreAsset.symbol
		);

		setUserBalances({
			poolAsset: userPoolToken.value,
			coreAsset: userCore.value,
		});
		// FIXME: Adding `getUserPoolShare` and `updateExchangePool` causes infinite loop
		//eslint-disable-next-line
	}, [balances, poolAsset, coreAsset]);

	//set core amount from token amount
	//define extrinsic & estimate fee
	useEffect(() => {
		if (!exchangePool || !poolAsset || !poolAssetAmount) return;
		if (poolAssetAmount <= 0) setCoreAmount(0);
		if (
			exchangePool.coreAssetBalance.isZero() ||
			exchangePool.assetBalance.isZero()
		) {
			setCoreAmount(poolAssetAmount);
		} else {
			const coreAmount = new Amount(Math.round(Number(poolAssetAmount)))
				.mul(exchangePool.coreAssetBalance)
				.div(exchangePool.assetBalance)
				.subn(ROUND_UP);

			if (coreAmount.toNumber() <= 0) {
				setCoreAmount(0);
			} else {
				setCoreAmount(coreAmount.toNumber());
				defineExtrinsic(
					poolAsset,
					new Amount(poolAssetAmount),
					coreAmount,
					poolAction
				);
			}
		}
		// FIXME: Adding 'defineExtrinsic' and 'exchangePool' causes infinite loop
		//eslint-disable-next-line
	}, [poolAssetAmount, poolAsset, poolAction]);

	//format pool liquidity
	useEffect(() => {
		if (!coreAsset || !poolAsset || !exchangePool) return;

		const poolAssetLiquidity = exchangePool.assetBalance.asString(
			poolAsset.decimals
		);
		const coreAssetLiquidity = exchangePool.coreAssetBalance.asString(
			coreAsset.decimals
		);

		setPoolLiquidity({
			poolAsset: poolAssetLiquidity,
			coreAsset: coreAssetLiquidity,
		});
	}, [coreAsset, poolAsset, exchangePool]);

	async function confirm() {
		await sendExtrinsic();
	}

	return (
		<Box
			component="form"
			sx={{
				width: "552px",
				height: "auto",
				margin: "0 auto",
				background: "#FFFFFF",
				border: "4px solid #1130FF",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				padding: "0px",
			}}
		>
			<Box
				sx={{
					mt: "30px",
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
				}}
			>
				<span
					style={{
						display: "flex",
						flexDirection: "row",
						alignContent: "justify",
						width: "100%",
					}}
				>
					<Button
						sx={{ borderRadius: "10%", ml: "10%" }}
						onClick={() =>
							setPoolAction(
								poolAction === PoolAction.ADD
									? PoolAction.REMOVE
									: PoolAction.ADD
							)
						}
					>
						<SwapHorizIcon sx={{ fontSize: "30px" }} />
					</Button>
					<Heading
						sx={{
							m: "10px 0 0 20px",
							fontSize: "24px",
							textTransform: "uppercase",
						}}
					>
						{poolAction} Liquidity
					</Heading>
				</span>
				<SmallText
					sx={{
						width: "80%",
						mt: "10px",
					}}
				>
					{poolAction === PoolAction.ADD ? (
						<>
							To keep the liquidity pool functional, deposits require an equal
							value of {poolAsset?.symbol || "your token"} and CPAY at the
							current exchange rate.
						</>
					) : (
						<>
							To keep the liquidity pool functional, withdrawals will return an
							equal value of {poolAsset?.symbol || "your token"} and CPAY at the
							current exchange rate.
						</>
					)}
				</SmallText>
			</Box>
			<TokenPicker
				setToken={setPoolAsset}
				setAmount={setPoolAssetAmount}
				amount={poolAssetAmount?.toString()}
				cennznet={true}
				removeToken={coreAsset}
			/>
			<span
				style={{
					display: "flex",
					flexDirection: "row",
					width: "80%",
				}}
			>
				<Image
					src={`/images/${coreAsset?.symbol.toLowerCase()}.svg`}
					height={40}
					width={40}
					alt="coreAsset logo"
				/>
				<TextField
					label="Amount"
					variant="outlined"
					value={coreAmount}
					sx={{
						width: "100%",
						m: "30px 0 30px 5%",
					}}
					helperText={
						userBalances ? `Balance: ${userBalances.coreAsset}` : null
					}
				/>
			</span>
			{!!poolAsset && <PoolSummary poolSummaryProps={poolSummaryProps} />}
			<Button
				sx={{
					fontFamily: "Teko",
					fontWeight: "bold",
					fontSize: "21px",
					lineHeight: "124%",
					color: "#1130FF",
					mt: "30px",
					mb: "50px",
				}}
				size="large"
				variant="outlined"
				onClick={confirm}
				disabled={poolAssetAmount <= 0 || coreAmount <= 0}
			>
				Confirm
			</Button>
		</Box>
	);
};

export default PoolForm;
