import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Box, CircularProgress } from "@mui/material";
import { Heading, SmallText } from "../../theme/StyledComponents";
import { useWallet } from "../../providers/SupportedWalletProvider";

const AccountBalances: React.FC<{
	selectedAccount: InjectedAccountWithMeta;
}> = ({ selectedAccount }) => {
	const router = useRouter();
	const [balancesToMap, setBalancesToMap] = useState<any>();
	const { getBridgeBalances, bridgeBalances, balances } = useWallet();

	useEffect(() => {
		if (router.asPath === "/bridge") getBridgeBalances(selectedAccount.address);
	}, [router.asPath]);

	useEffect(() => {
		if (router.asPath === "/bridge") {
			setBalancesToMap(bridgeBalances);
		} else {
			setBalancesToMap(balances);
		}
	}, [balances, bridgeBalances, router.asPath]);

	return (
		<>
			<Box sx={{ mt: "5%", pl: "5%", display: "flex" }}>
				<Heading
					sx={{
						color: "primary.main",
						fontSize: "18px",

						textTransform: "uppercase",
					}}
				>
					{selectedAccount.meta.name}&nbsp;
				</Heading>
				<Heading
					sx={{
						color: "black",
						fontSize: "18px",
						display: "flex",
					}}
				>
					{"[Account Name]"}
				</Heading>
			</Box>
			<SmallText sx={{ pl: "5%", opacity: "70%" }}>
				{selectedAccount.address}
			</SmallText>
			{balancesToMap ? (
				<Box sx={{ mt: "3%", pl: "5%", display: "block" }}>
					{Object.values(balancesToMap).map((token: any, i) => (
						<Box key={i}>
							<SmallText
								sx={{
									color: "black",
									fontSize: "18px",
									display: "inline-flex",
								}}
							>
								{token.symbol} Balance:
							</SmallText>
							<SmallText
								sx={{
									color: "black",
									fontWeight: "bold",
									fontSize: "18px",
									display: "inline-flex",
								}}
							>
								{token.balance || token.value}
							</SmallText>
							<br />
						</Box>
					))}
				</Box>
			) : (
				<>
					<SmallText
						sx={{ color: "primary.main", fontSize: "14", margin: "10px auto" }}
					>
						Fetching Balances...
					</SmallText>
					<CircularProgress sx={{ margin: "0 auto" }} />
				</>
			)}
		</>
	);
};

export default AccountBalances;
