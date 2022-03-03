import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import TokenPicker from "@/components/shared/TokenPicker";
import { CENNZAsset, PoolConfig, PoolValues, PoolSummaryProps } from "@/types";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { PoolAction, usePool } from "@/providers/PoolProvider";
import PoolSummary from "@/components/pool/PoolSummary";
import Settings from "@/components/pool/Settings";
import {
	checkLiquidityBalances,
	fetchCoreAmount,
	fetchExchangeRate,
	fetchTradeAmount,
} from "@/utils/pool";
import ConnectWalletButton from "@/components/shared/ConnectWalletButton";
import PoolSwapper from "@/components/pool/PoolSwapper";
import ExchangeIcon from "@/components/shared/ExchangeIcon";
import { formatBalance, fetchCENNZAssets } from "@/utils";

export enum PoolColors {
	ADD = "#1130FF",
	REMOVE = "#6200EE",
}

const PoolForm: React.FC<{}> = () => {
	const [assets, setAssets] = useState<CENNZAsset[]>();
	const [poolAction, setPoolAction] = useState<string>(PoolAction.ADD);
	const [poolColors, setPoolColors] = useState<string>(PoolColors.ADD);
	const [tradeAsset, setTradeAsset] = useState<CENNZAsset>(null);
	const [tradeAssetAmount, setTradeAssetAmount] = useState<number | string>("");
	const [_, setCoreAsset] = useState<CENNZAsset>(null);
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
	const { api } = useCENNZApi();
	const { balances } = useCENNZWallet();
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
		if (!api || assets) return;
		(async () => setAssets(await fetchCENNZAssets(api)))();
	}, [api, assets]);

	useEffect(() => {
		if (!exchangePool || !tradeAsset || !coreAsset) return;

		const exchangeRate = fetchExchangeRate(exchangePool, tradeAsset, coreAsset);

		setPoolSummaryProps({
			tradeAsset,
			poolLiquidity,
			exchangeRate,
		});
	}, [exchangePool, tradeAsset, coreAsset, poolLiquidity]);

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
		if (!balances?.length || !tradeAsset || !coreAsset || !userPoolShare)
			return;

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
			setCoreError("Balance Is Too Low");
			setTradeError("Balance Is Too Low");
		} else if (error === "core") {
			setCoreError("Balance Is Too Low");
		} else if (error === "trade") {
			setTradeError("Balance Is Too Low");
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
				try {
					setCoreAmount(formatBalance(coreAmount));
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
				} catch (err) {
					if (err.message.includes("Negative number"))
						setTradeError("Amount is too low");
					else setTradeError(err.message);
				}
			}
		} else {
			setCoreAmount(amount);
			const coreAmount = amount;
			const tradeAmount = fetchTradeAmount(coreAmount, exchangePool);

			if (tradeAmount <= 0) {
				setTradeAssetAmount(0);
			} else {
				try {
					setTradeAssetAmount(formatBalance(tradeAmount));
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
				} catch (err) {
					if (err.message.includes("Negative number"))
						setCoreError("Amount is too low");
					else setCoreError(err.message);
				}
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

	const swapAndResetPool = () => {
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
	};

	return (
		<div css={styles.poolBox}>
			<h1 css={styles.pageHeader}>
				{poolAction === PoolAction.ADD ? "Add to Pool" : "Withdraw from Pool"}
			</h1>
			<div css={styles.poolForm}>
				<PoolSwapper
					topText={"From"}
					poolAction={poolAction}
					onChange={swapAndResetPool}
				/>
				<ExchangeIcon
					onClick={swapAndResetPool}
					horizontal={true}
					color={PoolColors.REMOVE}
				/>
				<PoolSwapper
					topText={"To"}
					poolAction={poolAction}
					onChange={swapAndResetPool}
				/>
			</div>
			<div css={styles.copyBox}>
				<div css={styles.copy}>
					{poolAction === PoolAction.ADD
						? "To keep the liquidity pool functional, deposits require an equal value of "
						: "To keep the liquidity pool functional, withdrawals will return an equal value of "}
					<span css={styles.boldCopy}>
						{tradeAsset?.symbol || "your token"}
					</span>
					&nbsp;and&nbsp;
					<span css={styles.boldCopy}>CPAY</span>
					&nbsp;at the current exchange rate.
				</div>
				{poolAction === PoolAction.ADD ? (
					<div css={styles.copy}>
						By adding liquidity you will earn{" "}
						<span css={styles.boldCopy}>0.3%</span> of all trades on this pair
						proportional to your share of the pool.
					</div>
				) : (
					<div css={styles.copy}>
						Accrued fees can be claimed at any time by withdrawing your
						liquidity.
					</div>
				)}
			</div>
			<TokenPicker
				assets={assets}
				setToken={setTradeAsset}
				setAmount={setTradeAssetAmount}
				amount={tradeAssetAmount?.toString()}
				error={tradeError}
				removeToken={coreAsset}
				showBalance={true}
				poolConfig={poolConfig}
				whichAsset={"trade"}
			/>
			<TokenPicker
				assets={[coreAsset]}
				setToken={setCoreAsset}
				setAmount={setCoreAmount}
				amount={coreAmount?.toString()}
				error={coreError}
				showBalance={true}
				poolConfig={poolConfig}
				whichAsset={"core"}
			/>
			{balances && <PoolSummary poolSummaryProps={poolSummaryProps} />}
			<Settings
				slippage={slippage}
				setSlippage={setSlippage}
				coreAmount={coreAmount}
			/>
			<ConnectWalletButton
				onClick={confirm}
				color={poolAction === PoolAction.ADD ? "#1130FF" : "#9847FF"}
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
		</div>
	);
};

export const styles = {
	pageHeader: css`
		font-style: normal;
		font-weight: bold;
		font-size: 20px;
		line-height: 125%;
		text-align: center;
		letter-spacing: 1.12428px;
		text-transform: uppercase;
		color: #1130ff;
		padding-top: 26px;
	`,
	poolBox: css`
		margin: 0 auto 5%;
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	`,
	poolForm: css`
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin-top: 42px;
	`,
	copyBox: css`
		width: 468px;
		margin: -15px 0 40px;
	`,
	copy: css`
		font-size: 16px;
		line-height: 150%;
	`,
	boldCopy: css`
		font-weight: bold;
		color: #6200ee;
	`,
};

export default PoolForm;
