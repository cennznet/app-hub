import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Button, TextField } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TokenPicker from "../../components/shared/TokenPicker";
import { useCENNZApi } from "../../providers/CENNZApiProvider";
import SupportedAssetsProvider, {
	useAssets,
} from "../../providers/SupportedAssetsProvider";
import CENNZnetAccountPicker from "../../components/shared/CENNZnetAccountPicker";
import { Heading } from "../../theme/StyledComponents";

const CPAY = { id: 2, symbol: "CPAY", logo: "/images/cpay.svg", decimals: 4 };

const Pool: React.FC<{}> = () => {
	const [token, setToken] = useState<string>();
	const [tokenAmount, setTokenAmount] = useState<number>();
	const [cpayAmount, setCpayAmount] = useState<number>();
	const [isWithdraw, setIsWithdraw] = useState<boolean>(false);
	const [selectedAccount, updateSelectedAccount] = useState({
		address: "",
		name: "",
	});
	const { api, apiRx } = useCENNZApi();
	const assets = useAssets();

	async function confirm() {
		console.log({
			selectedAccount,
			isWithdraw,
			token,
			tokenAmount,
			cpayAmount,
		});
	}

	return (
		<SupportedAssetsProvider>
			<Box
				sx={{
					position: "absolute",
					top: "20%",
					left: "calc(50% - 552px/2)",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
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
						<CENNZnetAccountPicker
							updateSelectedAccount={updateSelectedAccount}
						/>
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
								onClick={() => setIsWithdraw(!isWithdraw)}
							>
								<SwapHorizIcon sx={{ fontSize: "30px" }} />
							</Button>
							<Heading
								sx={{
									m: "10px 0 0 10%",
									fontSize: "24px",
									textTransform: "uppercase",
								}}
							>
								{isWithdraw ? "Withdraw" : "Add"} Liquidity
							</Heading>
						</span>
					</Box>
					<TokenPicker setToken={setToken} cennznet={true} />
					<TextField
						label="Amount"
						variant="outlined"
						type="number"
						required
						sx={{
							width: "80%",
							m: "30px 0 30px",
						}}
						onChange={(e) => setTokenAmount(Number(e.target.value))}
					/>
					{/* <TokenPicker setToken={setCpay} cpay={true} /> */}
					<span
						style={{
							display: "flex",
							flexDirection: "row",
							width: "90%",
							marginLeft: "10%",
						}}
					>
						<TextField
							label="Amount"
							type="number"
							variant="outlined"
							required
							sx={{
								width: "80%",
								m: "30px 0 30px",
							}}
							onChange={(e) => setCpayAmount(Number(e.target.value))}
						/>
						<Image src={CPAY.logo} height={50} width={50} />
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
			</Box>
		</SupportedAssetsProvider>
	);
};

export default Pool;
