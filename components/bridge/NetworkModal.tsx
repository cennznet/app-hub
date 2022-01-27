import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Modal } from "@mui/material";
import {
	StyledModal,
	Heading,
	SmallText,
	Option,
} from "../../theme/StyledComponents";
import { useCENNZApi } from "../../providers/CENNZApiProvider";
import { useBlockchain } from "../../providers/BlockchainProvider";
import {
	networks,
	chainIds,
	chains,
	bridgeNetworks,
} from "../../utils/network";

const NetworkModal: React.FC<{
	setModalOpen: Function;
	setModalState: Function;
	currentNetwork: string;
}> = ({ setModalOpen, setModalState, currentNetwork }) => {
	const router = useRouter();
	const [open] = useState(true);
	const { api } = useCENNZApi();
	const { updateNetwork } = useBlockchain();

	const changeNetwork = async (selectedNetwork) => {
		if (api && api.isConnected) await api.disconnect();
		if (router.asPath === "/bridge") {
			const { ethereum }: any = window;
			const ethChainId = await ethereum.request({ method: "eth_chainId" });

			if (ethChainId !== chainIds[selectedNetwork]) {
				await ethereum.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: chainIds[selectedNetwork] }],
				});
				updateNetwork(ethereum, chains[selectedNetwork]);
			}
		}
		window.localStorage.setItem("CENNZnet-network", selectedNetwork);
		window.location.reload();
	};

	return (
		<Modal open={open}>
			<StyledModal
				sx={{
					justifyContent: "center",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Heading
					sx={{
						color: "primary.main",
						fontSize: "24px",
						mt: "3%",
						pl: "5%",
					}}
				>
					NOTE
				</Heading>
				<SmallText sx={{ pl: "5%", mb: "5%" }}>
					Please select one of these networks and wait for page to refresh
				</SmallText>
				<Heading
					sx={{
						color: "primary.main",
						fontSize: "24px",
						pl: "5%",
					}}
				>
					SELECT NETWORK
				</Heading>
				{networks.map((network, i) => (
					<Option
						sx={{
							width: "85%",
							margin: "0 auto",
							height: "53px",
							display: "flex",
							mb: "10px",
							border: "1px solid #1130FF",
							backgroundColor:
								currentNetwork === network ? "#1130FF" : "#FFFFFF",
						}}
						key={i}
						onClick={() => {
							changeNetwork(network);
							setModalState("");
							setModalOpen(false);
						}}
					>
						<SmallText
							sx={{
								fontSize: "20px",
								color: currentNetwork === network ? "#FFFFFF" : "black",
								textTransform: "none",
							}}
						>
							{router.asPath === "/bridge" ? bridgeNetworks[network] : network}
						</SmallText>
					</Option>
				))}
				<Button
					sx={{
						fontFamily: "Teko",
						fontWeight: "bold",
						fontSize: "21px",
						lineHeight: "124%",
						color: "#1130FF",
						width: "35%",
						m: "30px auto 50px",
						display: "flex",
					}}
					size="large"
					variant="outlined"
					onClick={() => {
						setModalState("");
						setModalOpen(false);
					}}
				>
					CLOSE
				</Button>
			</StyledModal>
		</Modal>
	);
};

export default NetworkModal;
