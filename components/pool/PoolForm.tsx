import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Heading, SmallText } from "../../theme/StyledComponents";
import TokenPicker from "../../components/shared/TokenPicker";
import { AssetInfo, PoolConfig, PoolValues } from "../../types";
import { useWallet } from "../../providers/SupportedWalletProvider";
import { PoolAction, usePool } from "../../providers/PoolProvider";
import { Amount } from "../../utils/Amount";
import PoolSummary from "./PoolSummary";
import SwapIconClass from "./SwapIcon";
import styles from "../../styles/components/swap/swap.module.css";

const ROUND_UP = 1;

export enum PoolColors {
	ADD = "#1130FF",
	REMOVE = "#6200EE",
}

const PoolForm: React.FC<{}> = () => {
	const [poolAction, setPoolAction] = useState<string>(PoolAction.ADD);
	const [poolColors, setPoolColors] = useState<string>(PoolColors.ADD);
	const [tradeAsset, setTradeAsset] = useState<AssetInfo>(null);
	const [tradeAssetAmount, setTradeAssetAmount] = useState<number | string>("");
	const [_, setCoreAsset] = useState<AssetInfo>(null);
	const [coreAmount, setCoreAmount] = useState<number | string>("");
	const [poolLiquidity, setPoolLiquidity] = useState<PoolValues>();
	const [userBalances, setUserBalances] = useState<PoolValues>();
	const [tradeError, setTradeError] = useState<string>();
	const [coreError, setCoreError] = useState<string>();
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

	const poolSummaryProps = {
		tradeAsset,
		poolLiquidity,
	};

	//set pool balances
	useEffect(() => {
		if (!tradeAsset || !balances || !coreAsset) return;
		updateExchangePool(tradeAsset);
		getUserPoolShare(tradeAsset);
		// FIXME: Adding `getUserPoolShare` and `updateExchangePool` causes infinite loop
		//eslint-disable-next-line
	}, [tradeAsset, balances, coreAsset]);

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
				coreAmount.toNumber() > userBalances.coreAsset &&
				tradeAmount.toNumber() > userBalances.tradeAsset
			) {
				setCoreError("Balance Too Low");
				setTradeError("Balance Too Low");
			} else if (coreAmount.toNumber() > userBalances.coreAsset) {
				setCoreError("Balance Too Low");
			} else if (tradeAmount.toNumber() > userBalances.tradeAsset) {
				setTradeError("Balance Too Low");
			}
		} else {
			if (
				coreAmount.toNumber() > userBalances.coreLiquidity &&
				tradeAmount.toNumber() > userBalances.tradeLiquidity
			) {
				setCoreError("Balance Too Low");
				setTradeError("Balance Too Low");
			} else if (coreAmount.toNumber() > userBalances.coreLiquidity) {
				setCoreError("Balance Too Low");
			} else if (tradeAmount.toNumber() > userBalances.tradeLiquidity) {
				setTradeError("Balance Too Low");
			}
		}
	};

	const setOtherAsset = async (amount, whichAsset?: string) => {
		setCoreError(null);
		setTradeError(null);
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
				checkBalances(poolAction, coreAmount, tradeAmount);
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
				checkBalances(poolAction, coreAmount, tradeAmount);
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

	const poolConfig: PoolConfig = {
		tradeAsset,
		coreAsset,
		userPoolShare,
		poolAction,
		setOtherAsset,
		setMax,
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
				margin: "0 auto 5%",
				background: "#FFFFFF",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				padding: "0px",
				boxShadow: "4px 8px 8px rgba(17, 48, 255, 0.1)",
			}}
		>
			<h1 className={styles.pageHeader}>POOL</h1>
			<Box
				style={{
					display: "flex",
					flexDirection: "row",
					alignContent: "justify",
					width: "468px",
					boxSizing: "border-box",
					border: `1px solid ${poolColors}`,
				}}
			>
				<SwapIconClass
					onClick={() => {
						setPoolAction(
							poolAction === PoolAction.ADD ? PoolAction.REMOVE : PoolAction.ADD
						);
						setPoolColors(
							poolColors === PoolColors.ADD ? PoolColors.REMOVE : PoolColors.ADD
						);
						setCoreAmount("");
						setTradeAssetAmount("");
						setCoreError(null);
						setTradeError(null);
					}}
					color={poolColors}
				/>
				<Typography
					sx={{
						m: "17px 0 0 20px",
						fontSize: "17px",
						lineHeight: "125%",
						fontWeight: "bold",
						textTransform: "uppercase",
						color: poolColors,
						letterSpacing: "1.2px",
					}}
				>
					{poolAction === PoolAction.ADD
						? "add too pool"
						: "withdraw from pool"}
				</Typography>
			</Box>
			<SmallText
				sx={{
					width: "80%",
					mt: "10px",
					marginBottom: "40px",
				}}
			>
				{poolAction === PoolAction.ADD ? (
					<Typography sx={{ fontSize: "16px", lineHeight: "150%" }}>
						To keep the liquidity pool functional, deposits require an equal
						value of&nbsp;
						<span
							style={{
								color: "#6200EE",
								fontSize: "16px",
								fontWeight: "bold",
								lineHeight: "150%",
							}}
						>
							{tradeAsset?.symbol || "your token"}
						</span>
						&nbsp;and&nbsp;
						<span
							style={{
								color: "#6200EE",
								fontSize: "16px",
								fontWeight: "bold",
								lineHeight: "150%",
							}}
						>
							CPAY
						</span>
						&nbsp;at the current exchange rate.
					</Typography>
				) : (
					<Typography sx={{ fontSize: "16px", lineHeight: "150%" }}>
						To keep the liquidity pool functional, withdrawals will return an
						equal value of&nbsp;
						<span
							style={{
								color: "#6200EE",
								fontSize: "16px",
								fontWeight: "bold",
								lineHeight: "150%",
							}}
						>
							{tradeAsset?.symbol || "your token"}
						</span>
						&nbsp;and&nbsp;
						<span
							style={{
								color: "#6200EE",
								fontSize: "16px",
								fontWeight: "bold",
								lineHeight: "150%",
							}}
						>
							CPAY
						</span>
						&nbsp;at the current exchange rate.
					</Typography>
				)}
			</SmallText>
			<TokenPicker
				setToken={setTradeAsset}
				setAmount={setTradeAssetAmount}
				amount={tradeAssetAmount?.toString()}
				error={tradeError}
				cennznet={true}
				removeToken={coreAsset}
				showBalance={true}
				poolConfig={poolConfig}
				whichAsset={"trade"}
			/>
			<TokenPicker
				setToken={setCoreAsset}
				setAmount={setCoreAmount}
				amount={coreAmount?.toString()}
				error={coreError}
				cennznet={true}
				forceSelection={coreAsset}
				removeToken={tradeAsset}
				showBalance={true}
				poolConfig={poolConfig}
				whichAsset={"core"}
			/>
			{/* {!!error && <Typography>{error}</Typography>} */}
			{!!tradeAsset && <PoolSummary poolSummaryProps={poolSummaryProps} />}
			<Button
				sx={{
					fontSize: "16px",
					lineHeight: "125%",
					color: poolColors,
					mt: "30px",
					mb: "50px",
					borderColor: poolColors,
					letterSpacing: "1.2px",
				}}
				size="large"
				variant="outlined"
				onClick={confirm}
				disabled={
					tradeAssetAmount <= 0 ||
					coreAmount <= 0 ||
					!!coreError ||
					!!tradeError
				}
			>
				<Typography sx={{ m: "5px 3px 5px 3px", fontWeight: "bold" }}>
					{poolAction === PoolAction.ADD ? "add to pool" : "withdraw from pool"}
				</Typography>
			</Button>
		</Box>
	);
};

export default PoolForm;
