import {
	createContext,
	useContext,
	useState,
	SetStateAction,
	Dispatch,
	FC,
	useCallback,
} from "react";
import { CENNZAsset, TxStatus } from "@/types";
import { Balance, fetchSwapAssets } from "@/utils";
import { useTokensFetcher } from "@/hooks";
import { CENNZ_ASSET_ID, CPAY_ASSET_ID } from "@/constants";
import { useTokenInput, TokenInputHook } from "@/hooks";

type CENNZAssetId = CENNZAsset["assetId"];

interface SwapContextType {
	exchangeAssets: CENNZAsset[];
	receiveAssets: CENNZAsset[];
	cpayAsset: CENNZAsset;
	setReceiveAssets: Dispatch<SetStateAction<CENNZAsset[]>>;
	exchangeToken: TokenInputHook<CENNZAssetId>[0];
	exchangeValue: TokenInputHook<CENNZAssetId>[1];
	receiveToken: TokenInputHook<CENNZAssetId>[0];
	receiveValue: TokenInputHook<CENNZAssetId>[1];
	exchangeAsset: CENNZAsset;
	receiveAsset: CENNZAsset;
	slippage: string;
	setSlippage: Dispatch<SetStateAction<string>>;

	txStatus: TxStatus;
	setTxStatus: Dispatch<SetStateAction<TxStatus>>;

	setProgressStatus: () => void;
	setSuccessStatus: () => void;
	setFailStatus: (errorCode?: string) => void;
}

const SwapContext = createContext<SwapContextType>({} as SwapContextType);

interface SwapProviderProps {
	supportedAssets: CENNZAsset[];
}

const SwapProvider: FC<SwapProviderProps> = ({ supportedAssets, children }) => {
	const [exchangeAssets] = useTokensFetcher<CENNZAsset[]>(
		fetchSwapAssets,
		supportedAssets
	);
	const [receiveAssets, setReceiveAssets] =
		useState<CENNZAsset[]>(exchangeAssets);

	const cennzAsset = exchangeAssets?.find(
		(asset) => asset.assetId === CENNZ_ASSET_ID
	);
	const cpayAsset = exchangeAssets?.find(
		(asset) => asset.assetId === CPAY_ASSET_ID
	);

	const [exchangeToken, exchangeValue] = useTokenInput(cennzAsset.assetId);
	const [receiveToken, receiveValue] = useTokenInput(cpayAsset.assetId);

	const exchangeAsset = exchangeAssets?.find(
		(asset) => asset.assetId === exchangeToken.tokenId
	);
	const receiveAsset = exchangeAssets?.find(
		(asset) => asset.assetId === receiveToken.tokenId
	);

	const [slippage, setSlippage] = useState<string>("5");
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
		const exValue = Balance.format(exchangeValue.value);
		const exSymbol = exchangeAsset.symbol;

		const reValue = Balance.format(receiveValue.value);
		const reSymbol = receiveAsset.symbol;

		setTxStatus({
			status: "success",
			title: "Transaction Completed",
			message: (
				<div>
					You successfully swapped{" "}
					<pre>
						<em>
							{exValue} {exSymbol}
						</em>
					</pre>{" "}
					for{" "}
					<pre>
						<em>
							{reValue} {reSymbol}
						</em>
					</pre>
					.
				</div>
			),
		});
	}, [
		exchangeValue.value,
		exchangeAsset.symbol,
		receiveValue.value,
		receiveAsset.symbol,
	]);

	return (
		<SwapContext.Provider
			value={{
				exchangeAssets,
				receiveAssets,
				setReceiveAssets,
				exchangeToken,
				exchangeValue,
				receiveToken,
				receiveValue,
				exchangeAsset,
				receiveAsset,
				cpayAsset,
				slippage,
				setSlippage,
				txStatus,
				setTxStatus,
				setProgressStatus,
				setSuccessStatus,
				setFailStatus,
			}}
		>
			{children}
		</SwapContext.Provider>
	);
};

export default SwapProvider;

export const useSwap = (): SwapContextType => useContext(SwapContext);
