import React from "react";
import { Box } from "@mui/material";
import { SwitchButton } from "../theme/StyledComponents";
import { useCENNZApi } from "../providers/CENNZApiProvider";
import { useBlockchain } from "../providers/BlockchainProvider";
import { chainIds, chains, apiUrls } from "../utils/networks";

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

		if (newLocation === "swap" || newLocation === "pool") {
			updateApi(apiUrls["Azalea"]);
			window.localStorage.setItem("CENNZnet-network", "Azalea");
		}
		setLocation(newLocation);
	}

	return (
		<Box
			sx={{
				width: "552px",
				left: "calc(50% - 552px/2)",
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				position: "absolute",
				top: "4%",
			}}
		>
			{indexColours && (
				<>
					<SwitchButton
						onClick={() => switchLocation("swap")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderLeft: "2px solid #1130FF",
							borderRight: "2px solid #1130FF",
						}}
					>
						swap
					</SwitchButton>
					<SwitchButton
						onClick={() => switchLocation("bridge")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderRight: "2px solid #1130FF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						onClick={() => switchLocation("pool")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderLeft: "2px solid #1130FF",
						}}
					>
						pool
					</SwitchButton>
				</>
			)}
			{location === "bridge" && (
				<>
					<SwitchButton
						onClick={() => switchLocation("swap")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
						}}
					>
						swap
					</SwitchButton>
					<SwitchButton
						style={{
							backgroundColor: "#1130FF",
							color: "#FFFFFF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						onClick={() => switchLocation("pool")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderLeft: "2px solid #1130FF",
						}}
					>
						pool
					</SwitchButton>
				</>
			)}
			{location === "swap" && (
				<>
					<SwitchButton
						style={{
							backgroundColor: "#1130FF",
							color: "#FFFFFF",
						}}
					>
						swap
					</SwitchButton>
					<SwitchButton
						onClick={() => switchLocation("bridge")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						onClick={() => switchLocation("pool")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderLeft: "2px solid #1130FF",
						}}
					>
						pool
					</SwitchButton>
				</>
			)}
			{location === "pool" && (
				<>
					<SwitchButton
						onClick={() => switchLocation("swap")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
						}}
					>
						swap
					</SwitchButton>
					<SwitchButton
						onClick={() => switchLocation("bridge")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						style={{
							backgroundColor: "#1130FF",
							color: "#FFFFFF",
							borderLeft: "2px solid #1130FF",
						}}
					>
						pool
					</SwitchButton>
				</>
			)}
		</Box>
	);
};

export default Switch;
