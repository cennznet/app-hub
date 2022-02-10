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
	const [tradeAsset, setTradeAsset] = useState<AssetInfo>(null);
	const [tradeAssetAmount, setTradeAssetAmount] = useState<number | string>("");
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
			tradeAsset,
			poolLiquidity,
		}),
		[tradeAsset, poolLiquidity]
	);

	//set pool balances
	useEffect(() => {
		if (!tradeAsset || !balances) return;
		updateExchangePool(tradeAsset);
		getUserPoolShare(tradeAsset);
		// FIXME: Adding `getUserPoolShare` and `updateExchangePool` causes infinite loop
		//eslint-disable-next-line
	}, [tradeAsset, balances]);

	//set user balances
	useEffect(() => {
		if (!balances || !tradeAsset || !coreAsset || !userPoolShare) return;
		const userTradeAsset = balances.find(
			(asset) => asset.symbol === tradeAsset.symbol
		);
		const userCore = balances.find(
			(asset) => asset.symbol === coreAsset.symbol
		);

		const userTradeLiquidity = userPoolShare.assetBalance.asString(
			tradeAsset.decimals
		);
		const userCoreLiquidity = userPoolShare.coreAssetBalance.asString(
			coreAsset.decimals
		);

		setUserBalances({
			tradeAsset: userTradeAsset.value,
			coreAsset: userCore.value,
			tradeLiquidity: Number(userTradeLiquidity),
			coreLiquidity: Number(userCoreLiquidity),
		});
	}, [balances, tradeAsset, coreAsset, userPoolShare]);

	//format pool liquidity
	useEffect(() => {
		if (!coreAsset || !tradeAsset || !exchangePool) return;

		const tradeAssetLiquidity = exchangePool.assetBalance.asString(
			tradeAsset.decimals
		);
		const coreAssetLiquidity = exchangePool.coreAssetBalance.asString(
			coreAsset.decimals
		);

		setPoolLiquidity({
			tradeAsset: tradeAssetLiquidity,
			coreAsset: coreAssetLiquidity,
		});
	}, [coreAsset, tradeAsset, exchangePool]);

	const checkBalances = (poolAction, coreAmount, tradeAmount) => {
		if (poolAction === PoolAction.ADD) {
			if (
				coreAmount.toNumber() > userBalances.coreAsset ||
				tradeAmount.toNumber() > userBalances.tradeAsset
			) {
				return false;
			}
		} else {
			if (
				coreAmount.toNumber() > userBalances.coreLiquidity ||
				tradeAmount.toNumber() > userBalances.tradeLiquidity
			) {
				return false;
			}
		}
		return true;
	};

	const setOtherAsset = async (amount, whichAsset?: string) => {
		setError(null);
		if (!exchangePool || !tradeAsset) return;
		if (amount <= 0) {
			setTradeAssetAmount(0);
			setCoreAmount(0);
			return;
		}

		if (
			exchangePool.coreAssetBalance.isZero() ||
			exchangePool.assetBalance.isZero()
		) {
			setCoreAmount(amount);
			setTradeAssetAmount(amount);
			return;
		}

		if (whichAsset === "trade") {
			setTradeAssetAmount(amount);
			const tradeAmount = new Amount(Math.round(Number(amount)));
			const coreAmount = tradeAmount
				.mul(exchangePool.coreAssetBalance)
				.div(exchangePool.assetBalance)
				.subn(ROUND_UP);

			if (coreAmount.toNumber() <= 0) {
				setCoreAmount(0);
			} else {
				setCoreAmount(coreAmount.toNumber());
				if (!checkBalances(poolAction, coreAmount, tradeAmount)) {
					setError("Balance Too Low");
					return;
				}
				//define extrinsic & estimate fee
				await defineExtrinsic(
					tradeAsset,
					tradeAmount,
					coreAmount,
					poolAction,
					false
				);
			}
		} else {
			setCoreAmount(amount);
			const coreAmount = new Amount(Math.round(Number(amount)));
			const tradeAmount = coreAmount
				.mul(exchangePool.assetBalance)
				.div(exchangePool.coreAssetBalance)
				.subn(ROUND_UP);

			if (tradeAmount.toNumber() <= 0) {
				setTradeAssetAmount(0);
			} else {
				setTradeAssetAmount(tradeAmount.toNumber());
				if (!checkBalances(poolAction, coreAmount, tradeAmount)) {
					setError("Balance Too Low");
					return;
				}
				//define extrinsic & estimate fee
				await defineExtrinsic(
					tradeAsset,
					tradeAmount,
					coreAmount,
					poolAction,
					false
				);
			}
		}
	};

	const setMax = async (whichAsset: string) => {
		if (poolAction === PoolAction.ADD) {
			let amount;
			if (whichAsset === "trade") {
				amount = Math.floor(Number(userBalances.tradeAsset));
				setTradeAssetAmount(amount);
				setOtherAsset(amount, whichAsset);
			} else {
				amount = Math.floor(Number(userBalances.coreAsset));
				setCoreAmount(amount);
				setOtherAsset(amount, whichAsset);
			}
		} else {
			await defineExtrinsic(
				tradeAsset,
				userBalances.tradeLiquidity,
				userBalances.coreLiquidity,
				poolAction,
				true
			);
			setTradeAssetAmount(Number(userBalances.tradeLiquidity));
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
							setTradeAssetAmount("");
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
							value of {tradeAsset?.symbol || "your token"} and CPAY at the
							current exchange rate.
						</>
					) : (
						<>
							To keep the liquidity pool functional, withdrawals will return an
							equal value of {tradeAsset?.symbol || "your token"} and CPAY at
							the current exchange rate.
						</>
					)}
				</SmallText>
			</Box>
			<TokenPicker
				setToken={setTradeAsset}
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
					value={tradeAssetAmount}
					sx={{
						width: "80%",
						m: "30px 0 0",
					}}
					helperText={
						poolAction === PoolAction.ADD
							? !!userBalances && `Balance: ${userBalances.tradeAsset}`
							: !!userPoolShare &&
							  `Withdrawable: ${userPoolShare.assetBalance.asString(
									tradeAsset?.decimals
							  )}`
					}
					onChange={(e) => setOtherAsset(e.target.value, "trade")}
				/>
				<Button
					sx={{
						position: "relative",
						display: "flex",
						height: "30px",
						mt: "40px",
					}}
					disabled={userBalances && tradeAsset ? false : true}
					onClick={() => setMax("trade")}
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
					onChange={(e) => setOtherAsset(e.target.value)}
				/>
				<Button
					sx={{
						position: "relative",
						display: "flex",
						height: "30px",
						mt: "40px",
					}}
					disabled={userBalances && tradeAsset ? false : true}
					onClick={() => setMax("core")}
				>
					Max
				</Button>
			</span>
			{!!tradeAsset && <PoolSummary poolSummaryProps={poolSummaryProps} />}
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
				disabled={tradeAssetAmount <= 0 || coreAmount <= 0 || !!error}
			>
				Confirm
			</Button>
		</Box>
	);
};

export default PoolForm;
