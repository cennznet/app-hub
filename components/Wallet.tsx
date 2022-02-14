import React, { useEffect, useState } from "react";
import { Frame, Heading, SmallText } from "../theme/StyledComponents";
import { useWallet } from "../providers/SupportedWalletProvider";
import WalletModal from "./shared/WalletModal";

const Wallet: React.FC<{}> = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [modalState, setModalState] = useState<string>("");
	const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
	const { selectedAccount, connectWallet } = useWallet();

	useEffect(() => {
		if (selectedAccount) setIsWalletConnected(true);
	}, [selectedAccount]);

	const walletClickHandler: React.EventHandler<React.SyntheticEvent> = (
		event: React.SyntheticEvent
	) => {
		if (isWalletConnected) {
			setModalOpen(true);
		} else {
			connectWallet();
			setModalOpen(true);
			setIsWalletConnected(true);
		}
	};

	return (
		<>
			{modalOpen && <WalletModal setModalOpen={setModalOpen} />}
			<Frame
				sx={{
					top: "4%",
					right: "5%",
					backgroundColor: modalOpen ? "#1130FF" : "#FFFFFF",
					cursor: "pointer",
					textAlign: isWalletConnected ? null : "center",
				}}
				onClick={walletClickHandler}
			>
				<img src="wallet.svg" alt="CENNZnet-wallet" />
				<Heading
					sx={{
						ml: isWalletConnected ? "5px" : 0,
						mt: "3px",
						fontSize: "20px",
						color: modalOpen ? "#FFFFFF" : "#1130FF",
						flexGrow: 1,
						whiteSpace: "nowrap",
					}}
				>
					{isWalletConnected ? "CENNZnet" : "CONNECT CENNZnet"}
				</Heading>
				{selectedAccount && (
					<SmallText
						sx={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							ml: "1.5px",
							fontSize: "15px",
							color: modalOpen ? "#FFFFFF" : "black",
						}}
					>
						{selectedAccount.meta.name}
					</SmallText>
				)}
			</Frame>
		</>
	);
};

export default Wallet;
