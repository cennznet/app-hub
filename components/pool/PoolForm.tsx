import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Box, Button, TextField, Typography } from "@mui/material";
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
	const [poolAssetAmount, setPoolAssetAmount] = useState<number | string>("");
	const [coreAmount, setCoreAmount] = useState<number | string>("");
	const [poolLiquidity, setPoolLiquidity] = useState<PoolValues>();
	const [userBalances, setUserBalances] = useState<PoolValues>();
	const [error, setError] = useState<string>();
	const { balances } = useWallet();
	const {
		coreAsset,
		exchangePool,
		updateExchangePool,
		defineExtrinsic,
		getUserPoolShare,
		userPoolShare,
		sendExtrinsic,
	} = usePool();

	const poolSummaryProps = useMemo(
		() => ({
			poolAsset,
			poolLiquidity,
		}),
		[poolAsset, poolLiquidity]
	);

	//set pool balances
	useEffect(() => {
		if (!poolAsset || !balances) return;
		updateExchangePool(poolAsset);
		getUserPoolShare(poolAsset);
		// FIXME: Adding `getUserPoolShare` and `updateExchangePool` causes infinite loop
		//eslint-disable-next-line
	}, [poolAsset, balances]);

	//set user balances
	useEffect(() => {
		if (!balances || !poolAsset || !coreAsset || !userPoolShare) return;
		const userPoolAsset = balances.find(
			(asset) => asset.symbol === poolAsset.symbol
		);
		const userCore = balances.find(
			(asset) => asset.symbol === coreAsset.symbol
		);

		const userPoolLiquidity = userPoolShare.assetBalance.asString(
			poolAsset.decimals
		);
		const userCoreLiquidity = userPoolShare.coreAssetBalance.asString(
			coreAsset.decimals
		);

		setUserBalances({
			poolAsset: userPoolAsset.value,
			coreAsset: userCore.value,
			poolLiquidity: Number(userPoolLiquidity),
			coreLiquidity: Number(userCoreLiquidity),
		});
	}, [balances, poolAsset, coreAsset, userPoolShare]);

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

	const checkBalances = (poolAction, coreAmount, poolAmount) => {
		if (poolAction === PoolAction.ADD) {
			if (
				coreAmount.toNumber() > userBalances.coreAsset ||
				poolAmount.toNumber() > userBalances.poolAsset
			) {
				return false;
			}
		} else {
			if (
				coreAmount.toNumber() > userBalances.coreLiquidity ||
				poolAmount.toNumber() > userBalances.poolLiquidity
			) {
				return false;
			}
		}
		return true;
	};

	//set core amount from poolAsset amount
	//define extrinsic & estimate fee
	const setCoreFromPool = async (amount) => {
		setError(null);
		if (!exchangePool || !poolAsset) return;
		if (amount <= 0) {
			setPoolAssetAmount(0);
			setCoreAmount(0);
		}
		setPoolAssetAmount(amount);
		if (
			exchangePool.coreAssetBalance.isZero() ||
			exchangePool.assetBalance.isZero()
		) {
			setCoreAmount(amount);
		} else {
			const poolAmount = new Amount(Math.round(Number(amount)));
			const coreAmount = poolAmount
				.mul(exchangePool.coreAssetBalance)
				.div(exchangePool.assetBalance)
				.subn(ROUND_UP);

			if (coreAmount.toNumber() <= 0) {
				setCoreAmount(0);
			} else {
				setCoreAmount(coreAmount.toNumber());
				if (!checkBalances(poolAction, coreAmount, poolAmount)) {
					setError("Balance Too Low");
					return;
				}
				await defineExtrinsic(
					poolAsset,
					poolAmount,
					coreAmount,
					poolAction,
					false
				);
			}
		}
	};

	const setPoolFromCore = async (amount) => {
		setError(null);
		if (!exchangePool || !poolAsset) return;
		if (amount <= 0) {
			setPoolAssetAmount(0);
			setCoreAmount(0);
		}
		setCoreAmount(amount);
		if (
			exchangePool.coreAssetBalance.isZero() ||
			exchangePool.assetBalance.isZero()
		) {
			setPoolAssetAmount(amount);
		} else {
			const coreAmount = new Amount(Math.round(Number(amount)));
			const poolAmount = coreAmount
				.mul(exchangePool.assetBalance)
				.div(exchangePool.coreAssetBalance)
				.subn(ROUND_UP);

			if (poolAmount.toNumber() <= 0) {
				setPoolAssetAmount(0);
			} else {
				setPoolAssetAmount(poolAmount.toNumber());
				if (!checkBalances(poolAction, coreAmount, poolAmount)) {
					setError("Balance Too Low");
					return;
				}
				await defineExtrinsic(
					poolAsset,
					poolAmount,
					coreAmount,
					poolAction,
					false
				);
			}
		}
	};

	const setMax = async () => {
		if (poolAction === PoolAction.ADD) {
			const amount = Math.floor(Number(userBalances.poolAsset));
			setPoolAssetAmount(amount);
			setCoreFromPool(amount);
		} else {
			await defineExtrinsic(
				poolAsset,
				userBalances.poolLiquidity,
				userBalances.coreLiquidity,
				poolAction,
				true
			);
			setPoolAssetAmount(Number(userBalances.poolLiquidity));
			setCoreAmount(Number(userBalances.coreLiquidity));
		}
	};

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
						onClick={() => {
							setPoolAction(
								poolAction === PoolAction.ADD
									? PoolAction.REMOVE
									: PoolAction.ADD
							);
							setCoreAmount("");
							setPoolAssetAmount("");
							setError(null);
						}}
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
			{!!error && <Typography>{error}</Typography>}
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
						poolAction === PoolAction.ADD
							? !!userBalances && `Balance: ${userBalances.poolAsset}`
							: !!userPoolShare &&
							  `Withdrawable: ${userPoolShare.assetBalance.asString(
									poolAsset?.decimals
							  )}`
					}
					onChange={(e) => setCoreFromPool(e.target.value)}
				/>
				<Button
					sx={{
						position: "relative",
						display: "flex",
						height: "30px",
						mt: "40px",
					}}
					disabled={userBalances && poolAsset ? false : true}
					onClick={setMax}
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
						poolAction === PoolAction.ADD
							? !!userBalances && `Balance: ${userBalances.coreAsset}`
							: !!userPoolShare &&
							  `Withdrawable: ${userPoolShare.coreAssetBalance.asString(
									coreAsset?.decimals
							  )}`
					}
					onChange={(e) => setPoolFromCore(e.target.value)}
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
				disabled={poolAssetAmount <= 0 || coreAmount <= 0 || !!error}
			>
				Confirm
			</Button>
		</Box>
	);
};

export default PoolForm;
