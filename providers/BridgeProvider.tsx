import { ETH_TOKEN_ADDRESS } from "@/constants";
import {
	useTokenInput,
	useTxStatus,
	TokenInputHook,
	TxStatusHook,
} from "@/hooks";
import useMetaMaskBalances from "@/hooks/useMetaMaskBalances";
import { BridgeAction, BridgedEthereumToken, EthereumToken } from "@/types";
import { Balance } from "@/utils";
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

type ERC20TokenAddress = EthereumToken["address"];

interface BridgeContextType extends TxStatusHook {
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

	metaMaskBalance: Balance;
	updateMetaMaskBalances: () => void;

	advancedExpanded: boolean;
	setAdvancedExpanded: Dispatch<SetStateAction<boolean>>;
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
	const [advancedExpanded, setAdvancedExpanded] = useState<boolean>(false);

	const ethAsset = (ethereumTokens as EthereumToken[])?.find(
		(token) => token.address === ETH_TOKEN_ADDRESS
	);

	const [transferSelect, transferInput] = useTokenInput(ethAsset.address);

	const transferAsset =
		(ethereumTokens as EthereumToken[])?.find(
			(token) => token.address === transferSelect.tokenId
		) || ethAsset;

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

				metaMaskBalance,
				updateMetaMaskBalances,

				advancedExpanded,
				setAdvancedExpanded,

				...useTxStatus(),
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
