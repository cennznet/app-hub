import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Button, TextField } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TokenPicker from "../../components/shared/TokenPicker";
import { useCENNZApi } from "../../providers/CENNZApiProvider";
import { useAssets, AssetInfo } from "../../providers/SupportedAssetsProvider";
import CENNZnetAccountPicker from "../../components/shared/CENNZnetAccountPicker";
import { Heading, SmallText } from "../../theme/StyledComponents";
import { PoolAction, usePool } from "../../providers/PoolProvider";

const CPAY = { id: 2, symbol: "CPAY", logo: "/images/cpay.svg", decimals: 4 };

const PoolForm: React.FC<{}> = () => {
	const [state, setState] = useState({
		poolAction: PoolAction.ADD,
		tokenAmount: 0,
		cpayAmount: 0,
	});
	const [token, setToken] = useState<AssetInfo>();
	const [selectedAccount, updateSelectedAccount] = useState({
		address: "",
		name: "",
	});
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

	async function confirm() {
		console.log({
			state,
			token,
			selectedAccount,
			assets,
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
				<CENNZnetAccountPicker updateSelectedAccount={updateSelectedAccount} />
				<span
					style={{
						display: "flex",
						flexDirection: "row",
						marginTop: "20px",
						alignContent: "justify",
						width: "100%",
					}}
				>
					<Button
						sx={{ borderRadius: "10%", ml: "10%" }}
						onClick={() =>
							setState({
								...state,
								poolAction:
									state.poolAction === PoolAction.ADD
										? PoolAction.REMOVE
										: PoolAction.ADD,
							})
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
						{state.poolAction} Liquidity
					</Heading>
				</span>
				<SmallText
					sx={{
						width: "80%",
						mt: "10px",
					}}
				>
					{state.poolAction === PoolAction.ADD ? (
						<>
							To keep the liquidity pool functional, deposits require an equal
							value of {token?.symbol || "your token"} and CPAY at the current
							exchange rate.
						</>
					) : (
						<>
							To keep the liquidity pool functional, withdrawals will return an
							equal value of {token?.symbol || "your token"} and CPAY at the
							current exchange rate.
						</>
					)}
				</SmallText>
			</Box>
			<span style={{ width: "80%", display: "flex", flexDirection: "row" }}>
				<TextField
					label="Amount"
					variant="outlined"
					type="number"
					required
					sx={{
						width: "80%",
						m: "30px 0 30px",
					}}
					onChange={(e) =>
						setState({ ...state, tokenAmount: Number(e.target.value) })
					}
				/>
				<TokenPicker setToken={setToken} cennznet={true} />
			</span>
			<span
				style={{
					display: "flex",
					flexDirection: "row",
					width: "80%",
				}}
			>
				<TextField
					label="Amount"
					type="number"
					variant="outlined"
					required
					sx={{
						width: "100%",
						m: "30px 5% 30px 0",
					}}
					onChange={(e) =>
						setState({ ...state, cpayAmount: Number(e.target.value) })
					}
				/>
				<Image src={CPAY.logo} height={40} width={40} />
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
