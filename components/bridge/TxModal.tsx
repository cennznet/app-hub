import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useGlobalModal } from "@/providers/GlobalModalProvider";

const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;

interface Props {
	modalState: string;
	modalOpen: boolean;
	modalText: string;
	modalTitle: string;
	etherscanHash: string;
	resetModal: Function;
}

const TxModal: React.FC<Props> = ({
	modalText,
	modalTitle,
	modalOpen,
	etherscanHash,
	modalState,
	resetModal,
}) => {
	const [etherscanLink, setEtherscanLink] = useState("");
	const [relayerStatus, updateRelayerStatus] = useState("");
	const [intervalId, setIntervalId] = useState<NodeJS.Timer>(null);
	const [eventConfirmations, setEventConfirmations] = useState(0);
	const [confirms, updateConfirms] = useState(0);
	const { api }: any = useCENNZApi();
	const { showDialog } = useGlobalModal();

	useEffect(() => {
		(async () => {
			const confirmations = (
				await api.query.ethBridge.eventConfirmations()
			).toNumber();

			setEventConfirmations(confirmations);
		})();
	}, [api]);

	const checkRelayerStatus = (relayerLink) => {
		axios.get(relayerLink).then((res) => {
			updateRelayerStatus(res.data.status);
		});
	};

	useEffect(() => {
		let relayerLink;

		switch (ETH_CHAIN_ID) {
			default:
			case "1":
				setEtherscanLink(`https://etherscan.io/tx/${etherscanHash}`);
				if (modalState === "relayer")
					relayerLink = `https://bridge-contracts.centralityapp.com/transactions/${etherscanHash}`;
				break;
			case "42":
				setEtherscanLink(`https://kovan.etherscan.io/tx/${etherscanHash}`);
				if (modalState === "relayer")
					relayerLink = `https://bridge-contracts.nikau.centrality.me/transactions/${etherscanHash}`;
				break;
		}

		if (modalState === "relayer") {
			switch (relayerStatus) {
				default:
					const interval = setInterval(
						() => checkRelayerStatus(relayerLink),
						10000
					);
					setIntervalId(interval);
					break;
				case "EthereumConfirming":
					updateConfirms(Math.round(0.33 * eventConfirmations));
					break;
				case "CennznetConfirming":
					updateConfirms(Math.round(0.66 * eventConfirmations));
					break;
				case "Successful":
					updateConfirms(eventConfirmations);
					clearInterval(intervalId);
					break;
			}
		}
		//eslint-disable-next-line
	}, [etherscanHash, modalState, relayerStatus]);

	useEffect(() => {
		if (modalOpen) {
			if (
				etherscanHash !== "" &&
				etherscanHash !== "noTokenSelected" &&
				modalState !== "relayer" &&
				etherscanLink !== ""
			) {
				showDialog({
					title: modalTitle,
					message: modalText,
					buttonText: "View on Etherscan",
					link: etherscanLink,
					disabled: false,
				});
			} else {
				showDialog({
					title: modalTitle,
					message: modalText,
					disabled: modalState === "withdrawCENNZside",
					callback: resetModal,
				});
			}
		}
	}, [modalOpen, modalText, modalState, etherscanLink]);

	return <></>;
};

export default TxModal;
