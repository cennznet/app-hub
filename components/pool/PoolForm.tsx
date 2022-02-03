import React, { useCallback, useEffect, useState } from "react";
import { AnyNumber } from "@cennznet/types";
import Image from "next/image";
import { Box, Button, TextField } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Heading, SmallText } from "../../theme/StyledComponents";
import TokenPicker from "../../components/shared/TokenPicker";
import { useAssets, AssetInfo } from "../../providers/SupportedAssetsProvider";
import { useWallet } from "../../providers/SupportedWalletProvider";
import { PoolAction, usePool } from "../../providers/PoolProvider";
import { Amount } from "../../utils/Amount";

const ROUND_UP = 1;

type UserBalances = {
	poolToken: number;
	core: number;
};

const PoolForm: React.FC<{}> = () => {
	const [poolAction, setPoolAction] = useState<string>(PoolAction.ADD);
	const [poolToken, setPoolToken] = useState<AssetInfo>(null);
	const [poolTokenAmount, setPoolTokenAmount] = useState<number>(0);
	const [coreAmount, setCoreAmount] = useState<AnyNumber>(0);
	const [userBalances, setUserBalances] = useState<UserBalances>();
	const { balances, selectedAccount } = useWallet();
	const assets = useAssets();
	const { coreAsset, fee, feeRate, exchangePool, updateExchangePool } =
		usePool();

	//get user balances
	useEffect(() => {
		if (!balances || !poolToken || !coreAsset) return;

		console.log("coreAsset", coreAsset);

		const userPoolToken = balances.find(
			(asset) => asset.symbol === poolToken.symbol
		);
		const userCore = balances.find(
			(asset) => asset.symbol === coreAsset.symbol
		);

		setUserBalances({ poolToken: userPoolToken.value, core: userCore.value });
	}, [balances, poolToken, coreAsset]);

	useEffect(() => {
		if (!poolToken) return;

		updateExchangePool(poolToken);
	}, [updateExchangePool, poolToken]);

	//set core amount from token amount
	useEffect(() => {
		if (!exchangePool || !poolToken) return;
		if (poolTokenAmount <= 0) setCoreAmount(0);

		if (
			exchangePool.coreAssetBalance.isZero() ||
			exchangePool.assetBalance.isZero()
		) {
			setCoreAmount(poolTokenAmount);
		} else {
			const coreAmount = new Amount(poolTokenAmount)
				.mul(exchangePool.coreAssetBalance)
				.div(exchangePool.assetBalance)
				.subn(ROUND_UP);

			setCoreAmount(coreAmount);
		}
		//eslint-disable-next-line
	}, [poolTokenAmount, exchangePool, poolToken]);

	async function confirm() {
		console.log({
			poolTokenAmount,
			coreAmount,
			poolToken,
		});
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
							value of {poolToken?.symbol || "your token"} and CPAY at the
							current exchange rate.
						</>
					) : (
						<>
							To keep the liquidity pool functional, withdrawals will return an
							equal value of {poolToken?.symbol || "your token"} and CPAY at the
							current exchange rate.
						</>
					)}
				</SmallText>
			</Box>
			<TokenPicker setToken={setPoolToken} cennznet={true} />
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
					value={poolTokenAmount}
					sx={{
						width: "80%",
						m: "30px 0 0",
					}}
					helperText={
						userBalances ? `Balance: ${userBalances.poolToken}` : null
					}
					onChange={(e) => setPoolTokenAmount(Number(e.target.value))}
				/>
				<Button
					sx={{
						position: "relative",
						display: "flex",
						height: "30px",
						mt: "40px",
					}}
					disabled={userBalances && poolToken ? false : true}
					onClick={() => setPoolTokenAmount(userBalances.poolToken)}
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
					type="number"
					variant="outlined"
					disabled={true}
					value={coreAmount}
					sx={{
						width: "100%",
						m: "30px 0 30px 5%",
					}}
					helperText={userBalances ? `Balance: ${userBalances.core}` : null}
					// onChange={(e) => setCoreAmount(Number(e.target.value))}
				/>
			</span>
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
			>
				Confirm
			</Button>
		</Box>
	);
};

export default PoolForm;
