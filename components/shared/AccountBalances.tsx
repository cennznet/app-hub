import React from "react";
import { Box, CircularProgress, Divider } from "@mui/material";
import { Heading, SmallText } from "@/components/StyledComponents";
import { useWallet } from "@/providers/SupportedWalletProvider";
import CENNZnetAccountPicker from "@/components/shared/CENNZnetAccountPicker";
import { formatBalance } from "@/utils";
import AccountIdenticon from "@/components/shared/AccountIdenticon";

const AccountBalances: React.FC<{
	updateSelectedAccount: Function;
}> = ({ updateSelectedAccount }) => {
	const { balances, selectedAccount } = useWallet();

	return (
		<>
			<Box sx={{ mt: "5%", pl: "5%", display: "flex", flexDirection: "row" }}>
				<AccountIdenticon
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
			{balances ? (
				<Box sx={{ mt: "3%", pl: "5%", display: "block" }}>
					{balances.map(
						(token: any, i) =>
							token.value > 0 && (
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
											src={token.logo}
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
										{formatBalance(token.value)}
										&nbsp;
										<span
											style={{
												fontWeight: "normal",
												fontSize: "16px",
												letterSpacing: "0.5px",
											}}
										>
											{token.symbol}
										</span>
									</SmallText>
									<br />
								</Box>
							)
					)}
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
