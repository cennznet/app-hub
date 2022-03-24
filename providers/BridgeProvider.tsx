import { ETH_TOKEN_ADDRESS } from "@/constants";
import { TokenInputHook, useTokenInput } from "@/hooks";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { BridgeAction, BridgedEthereumToken, EthereumToken } from "@/types";
import getERC20PegContract from "@/utils/getERC20PegContract";
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

interface BridgeContextType {
	bridgeAction: BridgeAction;
	setBridgeAction: Dispatch<SetStateAction<BridgeAction>>;

	erc20Tokens: EthereumToken[] | BridgedEthereumToken[];

	erc20Token: TokenInputHook<ERC20TokenAddress>[0];
	erc20Value: TokenInputHook<ERC20TokenAddress>[1];

	transferToken: EthereumToken | BridgedEthereumToken;

	transferAddress: string;
	setTransferAddress: Dispatch<SetStateAction<string>>;
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
