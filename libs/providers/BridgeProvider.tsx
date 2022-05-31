import { ETH_TOKEN_ADDRESS } from "@/libs/constants";
import {
	useTokenInput,
	useTxStatus,
	TokenInputHook,
	TxStatusHook,
	useSelectedAccount,
	useEthereumBalances,
} from "@hooks";
import {
	BridgeAction,
	BridgedEthereumToken,
	EthereumToken,
	WithdrawClaim,
} from "@/libs/types";
import { Balance, fetchUnclaimedWithdrawals } from "@utils";
import {
	createContext,
	Dispatch,
	FC,
	PropsWithChildren,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useCENNZApi } from "@providers/CENNZApiProvider";

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

	ethereumBalance: Balance;
	updateEthereumBalances: () => void;

	advancedExpanded: boolean;
	setAdvancedExpanded: Dispatch<SetStateAction<boolean>>;
	advancedMounted: boolean;
	setAdvancedMounted: Dispatch<SetStateAction<boolean>>;

	unclaimedWithdrawals: WithdrawClaim[];
	updateUnclaimedWithdrawals: () => void;
}

const BridgeContext = createContext<BridgeContextType>({} as BridgeContextType);

interface BridgeProviderProps {
	depositTokens: EthereumToken[];
	withdrawTokens: BridgedEthereumToken[];
}

const BridgeProvider: FC<PropsWithChildren<BridgeProviderProps>> = ({
	depositTokens,
	withdrawTokens,
	children,
}) => {
	const { api } = useCENNZApi();
	const selectedAccount = useSelectedAccount();
	const [bridgeAction, setBridgeAction] = useState<BridgeAction>("Deposit");
	const [ethereumTokens, setEthereumTokens] =
		useState<BridgeContextType["ethereumTokens"]>(depositTokens);
	const [transferCENNZAddress, setTransferCENNZAddress] =
		useState<BridgeContextType["transferCENNZAddress"]>("");
	const [transferMetaMaskAddress, setTransferMetaMaskAddress] =
		useState<BridgeContextType["transferMetaMaskAddress"]>("");
	const [advancedExpanded, setAdvancedExpanded] = useState<boolean>(false);
	const [advancedMounted, setAdvancedMounted] = useState<boolean>(false);
	const [unclaimedWithdrawals, setUnclaimedWithdrawals] =
		useState<WithdrawClaim[]>();

	const updateUnclaimedWithdrawals = useCallback(async () => {
		if (!api || !selectedAccount) return;
		setAdvancedMounted(false);

		const unclaimed: Awaited<ReturnType<typeof fetchUnclaimedWithdrawals>> =
			await fetchUnclaimedWithdrawals(selectedAccount.address, api);

		setUnclaimedWithdrawals(unclaimed?.filter(Boolean));

		setAdvancedMounted(true);
	}, [api, selectedAccount, setAdvancedMounted]);

	const ethAsset = (ethereumTokens as EthereumToken[])?.find(
		(token) => token.address === ETH_TOKEN_ADDRESS
	);

	const [transferSelect, transferInput] = useTokenInput(ethAsset.address);

	const transferAsset =
		(ethereumTokens as EthereumToken[])?.find(
			(token) => token.address === transferSelect.tokenId
		) || ethAsset;

	const [ethereumBalance, , updateEthereumBalances] =
		useEthereumBalances(transferAsset);

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

				ethereumBalance,
				updateEthereumBalances,

				advancedExpanded,
				setAdvancedExpanded,
				advancedMounted,
				setAdvancedMounted,

				unclaimedWithdrawals,
				updateUnclaimedWithdrawals,

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
