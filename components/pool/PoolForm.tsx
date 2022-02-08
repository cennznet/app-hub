import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Button, TextField, Typography } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Heading, SmallText } from "../../theme/StyledComponents";
import TokenPicker from "../../components/shared/TokenPicker";
import { AssetInfo } from "../../providers/SupportedAssetsProvider";
import { useWallet } from "../../providers/SupportedWalletProvider";
import { PoolAction, usePool } from "../../providers/PoolProvider";
import { Amount } from "../../utils/Amount";

const ROUND_UP = 1;

type PoolValues = {
	poolAsset: number | string;
	coreAsset: number | string;
};

const PoolForm: React.FC<{}> = () => {
	const [poolAction, setPoolAction] = useState<string>(PoolAction.ADD);
	const [poolAsset, setPoolAsset] = useState<AssetInfo>(null);
	const [poolAssetAmount, setPoolAssetAmount] = useState<Amount>(new Amount(0));
	const [coreAmount, setCoreAmount] = useState<Amount>(new Amount(0));
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
		//eslint-disable-next-line
	}, [balances, poolAsset, coreAsset]);

	//set core amount from token amount
	//define extrinsic & estimate fee
	useEffect(() => {
		if (!exchangePool || !poolAsset || !poolAssetAmount) return;
		if (poolAssetAmount.toNumber() <= 0) setCoreAmount(new Amount(0));
		if (
			exchangePool.coreAssetBalance.isZero() ||
			exchangePool.assetBalance.isZero()
		) {
			setCoreAmount(poolAssetAmount);
		} else {
			const coreAmount = new Amount(poolAssetAmount)
				.mul(exchangePool.coreAssetBalance)
				.div(exchangePool.assetBalance)
				.subn(ROUND_UP);

			if (coreAmount.toNumber() <= 0) {
				setCoreAmount(new Amount(0));
			} else {
				setCoreAmount(new Amount(coreAmount));
				defineExtrinsic(poolAsset, poolAssetAmount, coreAmount, poolAction);
			}
		}
		//eslint-disable-next-line
	}, [poolAssetAmount, poolAsset]);

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
				cennznet={true}
				removeToken={coreAsset}
			/>
			<Box
				sx={{
					width: "80%",
					height: "60px",
					display: "inline-flex",
					m: "30px auto 30px",
				}}
			>
				<TextField
					label="Amount"
					variant="outlined"
					required
					value={poolAssetAmount}
					sx={{
						width: "80%",
						m: "30px 0 0",
					}}
					helperText={
						userBalances ? `Balance: ${userBalances.poolAsset}` : null
					}
					onChange={(e) => setPoolAssetAmount(new Amount(e.target.value))}
				/>
				<Button
					sx={{
						position: "relative",
						display: "flex",
						height: "30px",
						mt: "40px",
					}}
					disabled={userBalances && poolAsset ? false : true}
					onClick={() => setPoolAssetAmount(new Amount(userBalances.poolAsset))}
				>
					Max
				</Button>
			</Box>
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
					// onChange={(e) => setCoreAmount(new Amount(e.target.value))}
				/>
			</span>
			{!!poolAsset && (
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
					{/* TODO - add this to Confirm Transaction popup */}
					{!!estimatedFee && (
						<Typography>
							Estimated Fee: {estimatedFee.asString(coreAsset.decimals)}{" "}
							{coreAsset.symbol}
						</Typography>
					)}
				</Box>
			)}
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
				disabled={poolAssetAmount.toNumber() <= 0 || coreAmount.toNumber() <= 0}
			>
				Confirm
			</Button>
		</Box>
	);
};

export default PoolForm;
