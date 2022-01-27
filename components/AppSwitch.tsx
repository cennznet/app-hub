import React from "react";
import store from "store";
import { Box } from "@mui/material";
import { SwitchButton } from "../theme/StyledComponents";
import { useCENNZApi } from "../providers/CENNZApiProvider";
import { useBlockchain } from "../providers/BlockchainProvider";
import { chainIds, chains, apiUrls } from "../utils/network";

const Switch: React.FC<{ location: string; setLocation: Function }> = ({
	location,
	setLocation,
}) => {
	const { api, updateApi } = useCENNZApi();
	const indexColours = location === undefined || location === "index";
	const { updateNetwork, Account } = useBlockchain();

	async function switchLocation(newLocation: string) {
		if (api && api.isConnected) await api.disconnect();
		if (newLocation === "bridge") {
			const { ethereum }: any = window;
			const ethChainId = await ethereum.request({ method: "eth_chainId" });
			const CENNZnetNetwork = window.localStorage.getItem("CENNZnet-network")
				? window.localStorage.getItem("CENNZnet-network")
				: "Azalea";

			if (ethChainId !== chainIds[CENNZnetNetwork] && Account) {
				await ethereum.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: chainIds[CENNZnetNetwork] }],
				});
				updateNetwork(ethereum, chains[CENNZnetNetwork]);
			}
		}

		if (newLocation === "exchange") {
			updateApi(apiUrls["Azalea"]);
			window.localStorage.setItem("CENNZnet-network", "Azalea");
		}
		setLocation(newLocation);
	}

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				marginTop: "2%",
			}}
		>
			{indexColours && (
				<>
					<SwitchButton
						onClick={() => switchLocation("bridge")}
						style={{
							left: "calc(50% - 276px/2 - 138px)",
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderRight: "2px solid #1130FF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						onClick={() => switchLocation("exchange")}
						style={{
							left: "calc(50% - 276px/2 - 138px)",
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderLeft: "2px solid #1130FF",
						}}
					>
						exchange
					</SwitchButton>
				</>
			)}
			{location === "bridge" && (
				<>
					<SwitchButton
						style={{
							left: "calc(50% - 276px/2 - 138px)",
							backgroundColor: "#1130FF",
							color: "#FFFFFF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						onClick={() => switchLocation("exchange")}
						style={{
							left: "calc(50% - 276px/2 - 138px)",
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
						}}
					>
						exchange
					</SwitchButton>
				</>
			)}
			{location === "exchange" && (
				<>
					<SwitchButton
						onClick={() => switchLocation("bridge")}
						style={{
							left: "calc(50% - 276px/2 - 138px)",
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						style={{
							left: "calc(50% - 276px/2 - 138px)",
							backgroundColor: "#1130FF",
							color: "#FFFFFF",
						}}
					>
						exchange
					</SwitchButton>
				</>
			)}
		</Box>
	);
};

export default Switch;
