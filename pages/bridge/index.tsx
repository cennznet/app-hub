import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Frame, Heading, SmallText } from "../../theme/StyledComponents";
import { useBlockchain } from "../../providers/BlockchainProvider";
import { useCENNZApi } from "../../providers/CENNZApiProvider";
import Switch from "../../components/bridge/Switch";
import Deposit from "../../components/bridge/Deposit";
import Withdraw from "../../components/bridge/Withdraw";

const Emery: React.FC<{}> = () => {
	const [isDeposit, toggleIsDeposit] = useState<boolean>(true);
	const { initBlockchain, Account } = useBlockchain();
	const { api, initApi } = useCENNZApi();

	useEffect(() => {
		if (!api?.isConnected) {
			initApi();
		}
	}, [api, initApi]);

	useEffect(() => {
		(async () => {
			const { ethereum }: any = window;
			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});

			if (!Account) initBlockchain(ethereum, accounts);
		})();
	}, [Account, initBlockchain]);

	return (
		<>
			<Typography
				sx={{
					position: "absolute",
					top: "4.5%",
					left: "16%",
					fontFamily: "Teko",
					fontStyle: "normal",
					fontWeight: "bold",
					fontSize: "24px",
					lineHeight: "124%",
					color: "black",
					letterSpacing: "1px",
				}}
			>
				ETHEREUM BRIDGE
			</Typography>
			<Switch isDeposit={isDeposit} toggleIsDeposit={toggleIsDeposit} />
			{Account && (
				<Frame
					sx={{
						top: "12%",
						right: "5%",
						backgroundColor: "#FFFFFF",
						cursor: "copy",
					}}
					onClick={() => navigator.clipboard.writeText(Account)}
				>
					<>
						<Heading
							sx={{
								color: "primary.main",
								ml: "10px",
								mt: "3px",
								fontSize: "20px",
								flexGrow: 1,
							}}
						>
							METAMASK
						</Heading>
						<SmallText sx={{ color: "black", fontSize: "16px" }}>
							{Account.substring(0, 6).concat(
								"...",
								Account.substring(Account.length - 4, Account.length)
							)}
						</SmallText>
					</>
				</Frame>
			)}
			{isDeposit ? <Deposit /> : <Withdraw />}
		</>
	);
};

export default Emery;
