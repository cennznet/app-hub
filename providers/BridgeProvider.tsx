import { ETH_TOKEN_ADDRESS } from "@/constants";
import { TokenInputHook, useTokenInput } from "@/hooks";
import useMetaMaskBalances from "@/hooks/useMetaMaskBalances";
import {
	BridgeAction,
	BridgedEthereumToken,
	EthereumToken,
	TxStatus,
} from "@/types";
import { Balance } from "@/utils";
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

type ERC20TokenAddress = EthereumToken["address"];

interface BridgeContextType {
	bridgeAction: BridgeAction;
	setBridgeAction: Dispatch<SetStateAction<BridgeAction>>;

	ethereumTokens: EthereumToken[] | BridgedEthereumToken[];

	transferSelect: TokenInputHook<ERC20TokenAddress>[0];
	transferInput: TokenInputHook<ERC20TokenAddress>[1];

	ethAsset: EthereumToken | BridgedEthereumToken;
	transferAsset: EthereumToken | BridgedEthereumToken;

	transferCENNZAddress: string;
	setTransferCENNZAddress: Dispatch<SetStateAction<string>>;

	transferMetaMaskAddress: string;
	setTransferMetaMaskAddress: Dispatch<SetStateAction<string>>;

	txStatus: TxStatus;
	setTxStatus: Dispatch<SetStateAction<TxStatus>>;

	setProgressStatus: () => void;
	setSuccessStatus: () => void;
	setFailStatus: (errorCode?: string) => void;

	metaMaskBalance: Balance;
	updateMetaMaskBalances: () => void;
}

const BridgeContext = createContext<BridgeContextType>({} as BridgeContextType);

interface BridgeProviderProps {
	depositTokens: EthereumToken[];
	withdrawTokens: BridgedEthereumToken[];
}

const BridgeProvider: FC<BridgeProviderProps> = ({
	depositTokens,
	withdrawTokens,
	children,
}) => {
	const [bridgeAction, setBridgeAction] = useState<BridgeAction>("Deposit");
	const [ethereumTokens, setEthereumTokens] =
		useState<BridgeContextType["ethereumTokens"]>(depositTokens);
	const [transferCENNZAddress, setTransferCENNZAddress] =
		useState<BridgeContextType["transferCENNZAddress"]>("");
	const [transferMetaMaskAddress, setTransferMetaMaskAddress] =
		useState<BridgeContextType["transferMetaMaskAddress"]>("");

	const ethAsset = (ethereumTokens as EthereumToken[])?.find(
		(token) => token.address === ETH_TOKEN_ADDRESS
	);

	const [transferSelect, transferInput] = useTokenInput(ethAsset.address);

	const transferAsset =
		(ethereumTokens as EthereumToken[])?.find(
			(token) => token.address === transferSelect.tokenId
		) || ethAsset;

	const [txStatus, setTxStatus] = useState<TxStatus>(null);

	const setProgressStatus = useCallback(() => {
		setTxStatus({
			status: "in-progress",
			title: "Transaction In Progress",
			message: (
				<div>
					Please sign the transaction when prompted and wait until it's
					completed
				</div>
			),
		});
	}, []);

	const setFailStatus = useCallback((errorCode?: string) => {
		setTxStatus({
			status: "fail",
			title: "Transaction Failed",
			message: (
				<div>
					An error occurred while processing your transaction
					{!!errorCode && (
						<>
							<br />
							<pre>
								<small>#{errorCode}</small>
							</pre>
						</>
					)}
				</div>
			),
		});
	}, []);

	const setSuccessStatus = useCallback(() => {
		const trValue = Balance.format(transferInput.value);
		const trSymbol = transferAsset.symbol;

		setTxStatus({
			status: "success",
			title: "Transaction Completed",
			...(bridgeAction === "Withdraw" && {
				message: (
					<div>
						You successfully withdrew{" "}
						<pre>
							<em>
								{trValue} {trSymbol}
							</em>
						</pre>{" "}
						from CENNZnet.
					</div>
				),
			}),

			...(bridgeAction === "Deposit" && {
				message: (
					<div>
						You successfully deposited{" "}
						<pre>
							<em>
								{trValue} {trSymbol}
							</em>
						</pre>{" "}
						to CENNZnet.
					</div>
				),
			}),
		});
	}, [transferInput.value, transferAsset?.symbol, bridgeAction]);

	const [metaMaskBalance, , updateMetaMaskBalances] =
		useMetaMaskBalances(transferAsset);

	useEffect(() => {
		const setTransferSelectTokenId = transferSelect.setTokenId;
		const ethereumTokens =
			bridgeAction === "Withdraw" ? withdrawTokens : depositTokens;

		setTransferSelectTokenId((currentTokenId) => {
			const token = ethereumTokens.find(
				(token) => token.address === currentTokenId
			);
			if (token) return currentTokenId;
			return ethereumTokens[0].address;
		});

		setEthereumTokens(ethereumTokens);
	}, [depositTokens, withdrawTokens, bridgeAction, transferSelect.setTokenId]);

	return (
		<BridgeContext.Provider
			value={{
				bridgeAction,
				setBridgeAction,

				ethereumTokens,

				transferSelect,
				transferInput,

				ethAsset,
				transferAsset,

				transferCENNZAddress,
				setTransferCENNZAddress,

				transferMetaMaskAddress,
				setTransferMetaMaskAddress,

				txStatus,
				setTxStatus,
				setProgressStatus,
				setSuccessStatus,
				setFailStatus,

				metaMaskBalance,
				updateMetaMaskBalances,
			}}
		>
			{children}
		</BridgeContext.Provider>
	);
};

export default BridgeProvider;

export function useBridge(): BridgeContextType {
	return useContext(BridgeContext);
}
