import { ETH_TOKEN_ADDRESS } from "@/constants";
import { TokenInputHook, useTokenInput } from "@/hooks";
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

	transferToken: TokenInputHook<ERC20TokenAddress>[0];
	transferValue: TokenInputHook<ERC20TokenAddress>[1];

	transferAsset: EthereumToken | BridgedEthereumToken;

	transferAddress: string;
	setTransferAddress: Dispatch<SetStateAction<string>>;

	txStatus: TxStatus;
	setTxStatus: Dispatch<SetStateAction<TxStatus>>;

	setProgressStatus: () => void;
	setSuccessStatus: () => void;
	setFailStatus: (errorCode?: string) => void;
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
	const [transferAddress, setTransferAddress] =
		useState<BridgeContextType["transferAddress"]>("");

	const ethAsset = (ethereumTokens as EthereumToken[])?.find(
		(token) => token.address === ETH_TOKEN_ADDRESS
	);

	const [transferToken, transferValue] = useTokenInput(ethAsset.address);

	const transferAsset = (ethereumTokens as EthereumToken[])?.find(
		(token) => token.address === transferToken.tokenId
	);

	const [txStatus, setTxStatus] = useState<TxStatus>(null);

	const setProgressStatus = useCallback(() => {
		setTxStatus({
			status: "in-progress",
			title: "Transaction In Progress",
			message: (
				<div>
					Please sign the transaction when prompted and wait until it is
					completed.
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
					An error has occurred while processing your transaction.
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
		const trValue = Balance.format(transferValue.value);
		const trSymbol = transferAsset.symbol;
		const action = bridgeAction === "Withdraw" ? "withdrew" : "deposited";

		setTxStatus({
			status: "success",
			title: "Transaction Completed",
			message: (
				<div>
					You successfully {action}{" "}
					<pre>
						<em>
							{trValue} {trSymbol}
						</em>
					</pre>
					.
				</div>
			),
		});
	}, [transferValue.value, transferAsset.symbol, bridgeAction]);

	useEffect(() => {
		if (bridgeAction === "Deposit") return setEthereumTokens(depositTokens);
		if (bridgeAction === "Withdraw") return setEthereumTokens(withdrawTokens);
	}, [depositTokens, withdrawTokens, bridgeAction]);

	return (
		<BridgeContext.Provider
			value={{
				bridgeAction,
				setBridgeAction,

				ethereumTokens,

				transferToken,
				transferValue,

				transferAsset,

				transferAddress,
				setTransferAddress,

				txStatus,
				setTxStatus,
				setProgressStatus,
				setSuccessStatus,
				setFailStatus,
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
