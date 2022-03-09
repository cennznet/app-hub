import {
	createContext,
	useEffect,
	useContext,
	useState,
	SetStateAction,
	Dispatch,
	FC,
} from "react";
import { CENNZAsset } from "@/types";
import { fetchSwapAssets } from "@/utils";
import { useTokensFetcher } from "@/hooks";
import { CENNZ_ASSET_ID, CPAY_ASSET_ID } from "@/constants";
import { useTokenInput, TokenInputHookType } from "@/hooks";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";

type CENNZAssetId = CENNZAsset["assetId"];

interface SwapContextType {
	exchangeTokens: CENNZAsset[];
	receiveTokens: CENNZAsset[];
	setReceiveTokens: Dispatch<SetStateAction<CENNZAsset[]>>;
	exchangeToken: TokenInputHookType<CENNZAssetId>[0];
	exchangeValue: TokenInputHookType<CENNZAssetId>[1];
	receiveToken: TokenInputHookType<CENNZAssetId>[0];
	receiveValue: TokenInputHookType<CENNZAssetId>[1];
	exchangeAsset: CENNZAsset;
	receiveAsset: CENNZAsset;
	exchangeBalance: number;
	receiveBalance: number;
	slippage: string;
	setSlippage: Dispatch<SetStateAction<string>>;
}

const SwapContext = createContext<SwapContextType>({} as SwapContextType);

interface SwapProviderProps {
	supportedAssets: CENNZAsset[];
}

const SwapProvider: FC<SwapProviderProps> = ({ supportedAssets, children }) => {
	const { balances } = useCENNZWallet();
	const [exchangeTokens] = useTokensFetcher<CENNZAsset[]>(
		fetchSwapAssets,
		supportedAssets
	);
	const [receiveTokens, setReceiveTokens] =
		useState<CENNZAsset[]>(exchangeTokens);

	const cennzAsset = exchangeTokens?.find(
		(token) => token.assetId === CENNZ_ASSET_ID
	);
	const cpayAsset = exchangeTokens?.find(
		(token) => token.assetId === CPAY_ASSET_ID
	);

	const [exchangeToken, exchangeValue] = useTokenInput(cennzAsset.assetId);
	const [receiveToken, receiveValue] = useTokenInput(cpayAsset.assetId);

	const exchangeAsset = exchangeTokens?.find(
		(token) => token.assetId === exchangeToken.tokenId
	);
	const receiveAsset = exchangeTokens?.find(
		(token) => token.assetId === receiveToken.tokenId
	);

	const [exchangeBalance, setExchangeBalance] = useState<number>(null);
	const [receiveBalance, setReceiveBalance] = useState<number>(null);

	const [slippage, setSlippage] = useState<string>("5");

	// Update asset balances for both send and receive assets
	useEffect(() => {
		if (!balances?.length) {
			setExchangeBalance(null);
			setReceiveBalance(null);
			return;
		}

		const sendBalance = balances.find(
			(balance) => balance.assetId === exchangeToken.tokenId
		);

		const receiveBalance = balances.find(
			(balance) => balance.assetId === receiveToken.tokenId
		);

		setExchangeBalance(sendBalance.value);
		setReceiveBalance(receiveBalance.value);
	}, [balances, exchangeToken.tokenId, receiveToken.tokenId]);

	return (
		<SwapContext.Provider
			value={{
				exchangeTokens,
				receiveTokens,
				setReceiveTokens,
				exchangeToken,
				exchangeValue,
				receiveToken,
				receiveValue,
				exchangeAsset,
				receiveAsset,
				exchangeBalance,
				receiveBalance,
				slippage,
				setSlippage,
			}}
		>
			{children}
		</SwapContext.Provider>
	);
};

export default SwapProvider;

export const useSwap = (): SwapContextType => useContext(SwapContext);
