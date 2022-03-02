import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useGlobalModal } from "@/providers/GlobalModalProvider";
import { TxModalAttributes } from "@/types";

const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;

interface Props {
	modalOpen: boolean;
	modalAttributes: TxModalAttributes;
	resetModal: Function;
}

const TxModal: React.FC<Props> = ({
	modalAttributes,
	modalOpen,
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
		if (modalAttributes?.hash) {
			switch (ETH_CHAIN_ID) {
				default:
				case "1":
					setEtherscanLink(`https://etherscan.io/tx/${modalAttributes.hash}`);
					if (modalAttributes.state === "relayer")
						relayerLink = `https://bridge-contracts.centralityapp.com/transactions/${modalAttributes.hash}`;
					break;
				case "42":
					setEtherscanLink(
						`https://kovan.etherscan.io/tx/${modalAttributes.hash}`
					);
					if (modalAttributes.state === "relayer")
						relayerLink = `https://bridge-contracts.nikau.centrality.me/transactions/${modalAttributes.hash}`;
					break;
			}
		}

		if (modalAttributes?.state && modalAttributes.state === "relayer") {
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
	}, [modalAttributes, relayerStatus]);

	useEffect(() => {
		if (modalOpen && modalAttributes) {
			if (
				modalAttributes?.hash &&
				modalAttributes.hash !== "noTokenSelected" &&
				modalAttributes.state !== "relayer" &&
				etherscanLink !== ""
			) {
				showDialog({
					title: modalAttributes.title,
					message: modalAttributes.text,
					buttonText: "View on Etherscan",
					link: etherscanLink,
					disabled: false,
					loading: true,
				});
			} else {
				showDialog({
					title: modalAttributes.title,
					message: modalAttributes.text,
					disabled: modalAttributes.state === "withdrawCENNZside",
					callback: resetModal,
					loading: modalAttributes.state !== "finished",
				});
			}
		}
		//FIXME: adding 'showDialog' causes infinite loop
		//eslint-disable-next-line
	}, [modalOpen, modalAttributes, etherscanLink]);

	return null;
};

export default TxModal;
