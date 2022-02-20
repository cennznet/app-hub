import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { SmallText } from "@/components/StyledComponents";
import TokenPicker from "@/components/shared/TokenPicker";
import { AssetInfo, PoolConfig, PoolValues } from "@/types";
import { useWallet } from "@/providers/SupportedWalletProvider";
import { PoolAction, usePool } from "@/providers/PoolProvider";
import SwapIconClass from "@/components/pool/SwapIcon";
import styles from "@/styles/components/swap/swap.module.css";
import { PoolSummaryProps } from "@/types";
import PoolSummary from "@/components/pool/PoolSummary";
import Settings from "@/components/pool/Settings";
import {
	checkLiquidityBalances,
	fetchCoreAmount,
	fetchExchangeRate,
	fetchTradeAmount,
} from "@/utils/pool";
import ConnectWalletButton from "@/components/shared/ConnectWalletButton";

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
	const [slippage, setSlippage] = useState<number>(5);
	const [poolSummaryProps, setPoolSummaryProps] = useState<PoolSummaryProps>({
		tradeAsset,
		poolLiquidity,
		exchangeRate: null,
	});
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

	useEffect(() => {
		if (!exchangePool) return;

		const exchangeRate = fetchExchangeRate(exchangePool);

		setPoolSummaryProps({
			tradeAsset,
			poolLiquidity,
			exchangeRate,
		});
	}, [exchangePool, tradeAsset, poolLiquidity]);

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
		const error = checkLiquidityBalances(
			poolAction,
			coreAmount,
			tradeAmount,
			userBalances
		);
		if (error === "coreAndTrade") {
			setCoreError("Balance Too Low");
			setTradeError("Balance Too Low");
		} else if (error === "core") {
			setCoreError("Balance Too Low");
		} else if (error === "trade") {
			setTradeError("Balance Too Low");
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
			const tradeAmount = amount;
			setTradeAssetAmount(tradeAmount);
			const coreAmount = fetchCoreAmount(tradeAmount, exchangePool);

			if (coreAmount <= 0) {
				setCoreAmount(0);
			} else {
				setCoreAmount(coreAmount.toFixed(4));
				checkBalances(poolAction, coreAmount, tradeAmount);
				//define extrinsic & estimate fee
				await defineExtrinsic(
					tradeAsset,
					tradeAmount,
					coreAmount,
					poolAction,
					false,
					slippage / 100
				);
			}
		} else {
			setCoreAmount(amount);
			const coreAmount = amount;
			const tradeAmount = fetchTradeAmount(coreAmount, exchangePool);

			if (tradeAmount <= 0) {
				setTradeAssetAmount(0);
			} else {
				setTradeAssetAmount(tradeAmount.toFixed(4));
				checkBalances(poolAction, coreAmount, tradeAmount);
				//define extrinsic & estimate fee
				await defineExtrinsic(
					tradeAsset,
					tradeAmount,
					coreAmount,
					poolAction,
					false,
					slippage / 100
				);
			}
		}
	};

	const setMax = async (whichAsset: string) => {
		if (poolAction === PoolAction.ADD) {
			if (whichAsset === "trade") {
				setTradeAssetAmount(userBalances.tradeAsset);
				setOtherAsset(userBalances.tradeAsset, whichAsset);
			} else {
				setCoreAmount(userBalances.coreAsset);
				setOtherAsset(userBalances.coreAsset, whichAsset);
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

	//update extrinsic on slippage change
	useEffect(() => {
		if (!slippage || !poolAction || !tradeAssetAmount || !coreAmount) return;
		(async () => {
			await defineExtrinsic(
				tradeAsset,
				tradeAssetAmount,
				coreAmount,
				poolAction,
				false,
				slippage / 100
			);
		})();
		// FIXME: adding 'defineExtrinsic' cause infinite loop
		//eslint-disable-next-line
	}, [slippage, poolAction, tradeAsset, tradeAssetAmount, coreAmount]);

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
				sx={{
					display: "flex",
					flexDirection: "row",
					alignContent: "justify",
					width: "468px",
					boxSizing: "border-box",
					border: `1px solid ${poolColors}`,
					mt: "30px",
					cursor: "pointer",
				}}
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
			>
				<SwapIconClass onClick={() => null} color={poolColors} />
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
					{poolAction === PoolAction.ADD ? "add to pool" : "withdraw from pool"}
				</Typography>
			</Box>
			<SmallText
				sx={{
					width: "468px",
					m: "20px 0 40px",
				}}
			>
				<Typography sx={{ fontSize: "16px", lineHeight: "150%" }}>
					{poolAction === PoolAction.ADD
						? "To keep the liquidity pool functional, deposits require an equal value of "
						: "To keep the liquidity pool functional, withdrawals will return an equal value of "}
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
			<PoolSummary poolSummaryProps={poolSummaryProps} />
			<Settings
				slippage={slippage}
				setSlippage={setSlippage}
				coreAmount={coreAmount}
			/>
			<ConnectWalletButton
				onClick={confirm}
				buttonText={
					poolAction === PoolAction.ADD ? "add to pool" : "withdraw from pool"
				}
				requireMetamask={false}
				requireCennznet={true}
				disabled={
					tradeAssetAmount <= 0 ||
					coreAmount <= 0 ||
					!!coreError ||
					!!tradeError
				}
			/>
		</Box>
	);
};

export default PoolForm;
