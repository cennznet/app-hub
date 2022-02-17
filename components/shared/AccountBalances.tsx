import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, CircularProgress, Divider } from "@mui/material";
import { Heading, SmallText } from "../../theme/StyledComponents";
import { useWallet } from "../../providers/SupportedWalletProvider";
import { ETH_LOGO } from "../../utils/bridge/helpers";
import CENNZnetAccountPicker from "./CENNZnetAccountPicker";
import ERC20Tokens from "../../artifacts/erc20tokens.json";

const AccountBalances: React.FC<{
	updateSelectedAccount: Function;
}> = ({ updateSelectedAccount }) => {
	const { getBridgeBalances, bridgeBalances, selectedAccount } = useWallet();

	useEffect(() => {
		getBridgeBalances(selectedAccount.address);
	}, [getBridgeBalances, selectedAccount]);

	const Identicon = dynamic(() => import("@polkadot/react-identicon"), {
		loading: () => <CircularProgress />,
	});

	return (
		<>
			<Box sx={{ mt: "5%", pl: "5%", display: "flex", flexDirection: "row" }}>
				<Identicon
					value={selectedAccount.address}
					theme="beachball"
					size={50}
				/>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						mt: "10px",
						ml: "10px",
					}}
				>
					<Heading
						sx={{
							color: "primary.main",
							fontSize: "16px",
							textTransform: "uppercase",
						}}
					>
						{selectedAccount?.meta?.name}
					</Heading>
					<SmallText
						sx={{ opacity: "70%", cursor: "copy", fontSize: "14px" }}
						onClick={() =>
							navigator.clipboard.writeText(selectedAccount.address)
						}
					>
						{selectedAccount.address
							.substring(0, 8)
							.concat(
								"...",
								selectedAccount.address.substring(
									selectedAccount.address.length - 8,
									selectedAccount.address.length
								)
							)}
					</SmallText>
				</Box>
			</Box>
			<Box sx={{ m: "15px 5% 0 5%" }}>
				<CENNZnetAccountPicker
					updateSelectedAccount={updateSelectedAccount}
					wallet={true}
				/>
			</Box>
			<Divider sx={{ m: "15px 0 15px" }} />
			<Heading sx={{ pl: "5%" }}>Balance</Heading>
			{bridgeBalances ? (
				<Box sx={{ mt: "3%", pl: "5%", display: "block" }}>
					{Object.values(bridgeBalances).map((token: any, i) => {
						let logo;
						ERC20Tokens.tokens.map((erc20token) => {
							if (erc20token.symbol === token.symbol) {
								logo = erc20token.logoURI;
							}
						});

						return (
							<Box
								key={i}
								sx={{
									display: "flex",
									height: "50px",
									verticalAlign: "center",
								}}
							>
								<Box sx={{ m: "10px 10px" }}>
									<img
										style={{ width: "40px", height: "40px" }}
										src={
											logo
												? logo
												: token.symbol === "ETH"
												? ETH_LOGO
												: `images/${token.symbol.toLowerCase()}.svg`
										}
										alt={`${token.symbol}-logo`}
									/>
								</Box>
								<SmallText
									sx={{
										color: "black",
										fontWeight: "bold",
										fontSize: "18px",
										display: "inline-flex",
										mt: "18px",
									}}
								>
									{token.balance?.toFixed(4) || token.value?.toFixed(4)}
								</SmallText>
								<br />
							</Box>
						);
					})}
				</Box>
			) : (
				<Box sx={{ m: "5% 0 0 calc(5% + 10px)" }}>
					<CircularProgress />
				</Box>
			)}
		</>
	);
};

export default AccountBalances;
