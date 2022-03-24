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

	erc20Tokens: EthereumToken[] | BridgedEthereumToken[];

	erc20Token: TokenInputHook<ERC20TokenAddress>[0];
	erc20Value: TokenInputHook<ERC20TokenAddress>[1];

	transferToken: EthereumToken | BridgedEthereumToken;

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
	const [erc20Tokens, setERC20Tokens] =
		useState<BridgeContextType["erc20Tokens"]>(depositTokens);
	const [transferAddress, setTransferAddress] =
		useState<BridgeContextType["transferAddress"]>("");

	const ethToken = (erc20Tokens as EthereumToken[])?.find(
		(token) => token.address === ETH_TOKEN_ADDRESS
	);

	const [erc20Token, erc20Value] = useTokenInput(ethToken.address);

	const transferToken = (erc20Tokens as EthereumToken[])?.find(
		(token) => token.address === erc20Token.tokenId
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
		const trValue = Balance.format(erc20Value.value);
		const trSymbol = transferToken.symbol;
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
	}, [erc20Value.value, transferToken.symbol, bridgeAction]);

	useEffect(() => {
		if (bridgeAction === "Deposit") return setERC20Tokens(depositTokens);
		if (bridgeAction === "Withdraw") return setERC20Tokens(withdrawTokens);
	}, [depositTokens, withdrawTokens, bridgeAction]);

	return (
		<BridgeContext.Provider
			value={{
				bridgeAction,
				setBridgeAction,
				erc20Tokens,
				erc20Token,
				erc20Value,

				transferToken,

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
