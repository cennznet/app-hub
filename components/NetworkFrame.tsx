import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Frame, Heading, SmallText } from "../theme/StyledComponents";
import { useCENNZApi } from "../providers/CENNZApiProvider";
import NetworkModal from "./bridge/NetworkModal";
import { apiUrls, bridgeNetworks } from "../utils/network";

const NetworkFrame: React.FC<{}> = () => {
	const router = useRouter();
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [currentNetwork, setCurrentNetwork] = useState<string>("");
	const [modalState, setModalState] = useState<string>("");
	const { api, updateApi }: any = useCENNZApi();

	useEffect(() => {
		if (router.asPath === "/exchange") {
			setCurrentNetwork("Azalea");
			window.localStorage.setItem("CENNZnet-network", "Azalea");
			return;
		}
		const CENNZnetNetwork = window.localStorage.getItem("CENNZnet-network")
			? window.localStorage.getItem("CENNZnet-network")
			: "Azalea";
		if (!api) updateApi(apiUrls[CENNZnetNetwork]);

		router.asPath === "/bridge"
			? setCurrentNetwork(bridgeNetworks[CENNZnetNetwork])
			: setCurrentNetwork(CENNZnetNetwork);
	}, [api, updateApi, router.asPath]);

	return (
		<>
			{modalOpen && modalState === "networks" && (
				<NetworkModal
					setModalOpen={setModalOpen}
					setModalState={setModalState}
					currentNetwork={currentNetwork}
				/>
			)}
			<Frame
				sx={{
					position: "absolute",
					cursor: router.asPath !== "/exchange" && "pointer",
					top: "4%",
					right: "5%",
					backgroundColor: modalState === "networks" ? "#1130FF" : "#FFFFFF",
				}}
				onClick={() => {
					if (router.asPath !== "/exchange") {
						setModalOpen(true);
						setModalState("networks");
					}
				}}
			>
				<Heading
					sx={{
						ml: "10px",
						mt: "3px",
						fontSize: "20px",
						flexGrow: 1,
						color: modalState === "networks" ? "#FFFFFF" : "#1130FF",
					}}
				>
					NETWORK
				</Heading>
				<SmallText
					sx={{
						color: modalState === "networks" ? "#FFFFFF" : "black",
					}}
				>
					{currentNetwork}
				</SmallText>
			</Frame>
		</>
	);
};

export default NetworkFrame;
