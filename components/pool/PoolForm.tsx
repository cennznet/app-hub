import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Button, TextField } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Heading, SmallText } from "../../theme/StyledComponents";
import TokenPicker from "../../components/shared/TokenPicker";
import { useCENNZApi } from "../../providers/CENNZApiProvider";
import { useAssets, AssetInfo } from "../../providers/SupportedAssetsProvider";
import { useWallet } from "../../providers/SupportedWalletProvider";
import { PoolAction, usePool } from "../../providers/PoolProvider";
import { Amount, AmountUnit } from "../../utils/Amount";
import BigNumber from "bignumber.js";

const CPAY = { id: 2, symbol: "CPAY", logo: "/images/cpay.svg", decimals: 4 };

type UserBalances = {
	poolToken: number;
	cpay: number;
};

const PoolForm: React.FC<{}> = () => {
	const [poolAction, setPoolAction] = useState<string>(PoolAction.ADD);
	const [poolToken, setPoolToken] = useState<AssetInfo>();
	const [poolTokenAmount, setPoolTokenAmount] = useState<number>(0);
	const [cpayAmount, setCpayAmount] = useState<number>(0);
	const [userBalances, setUserBalances] = useState<UserBalances>();
	const { balances } = useWallet();
	const { api, apiRx } = useCENNZApi();
	const assets = useAssets();
	const {
		assetReserve,
		coreReserve,
		coreAssetId,
		fee,
		feeRate,
		userShareInPool,
	} = usePool();

	//get user balances
	useEffect(() => {
		if (!balances || !poolToken) return;

		const userPoolToken = balances.find(
			(asset) => asset.symbol === poolToken.symbol
		);
		const userCpay = balances.find((asset) => asset.symbol === "CPAY");

		setUserBalances({ poolToken: userPoolToken.value, cpay: userCpay.value });
	}, [balances, poolToken]);

	//set CPAY amount
	useEffect(() => {
		if (!api || !assets || !poolToken || poolTokenAmount <= 0) return;
		(async () => {
			const CPAY = assets.find((asset) => asset.symbol === "CPAY");

			let tokenValue: any = new BigNumber(poolTokenAmount.toString());
			tokenValue = tokenValue
				.multipliedBy(Math.pow(10, poolToken.decimals))
				.toString(10);

			const { price } = await (api.rpc as any).cennzx.sellPrice(
				CPAY.id,
				tokenValue,
				poolToken.id
			);

			let poolCpayAmount: any = new Amount(
				price.toString(),
				AmountUnit.UN
			).toAmount(CPAY.decimals);

			setCpayAmount(Number(poolCpayAmount.toString(10)));
		})();
	}, [api, assets, poolToken, poolTokenAmount, setCpayAmount]);

	async function confirm() {
		console.log({
			poolTokenAmount,
			cpayAmount,
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
				<Image src={CPAY.logo} height={40} width={40} alt="CPAY logo" />
				<TextField
					label="Amount"
					type="number"
					variant="outlined"
					required
					value={cpayAmount}
					sx={{
						width: "100%",
						m: "30px 0 30px 5%",
					}}
					helperText={userBalances ? `Balance: ${userBalances.cpay}` : null}
					// onChange={(e) => setCpayAmount(Number(e.target.value))}
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
