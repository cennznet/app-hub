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
	exchangeSelect: TokenInputHook<CENNZAssetId>[0];
	exchangeInput: TokenInputHook<CENNZAssetId>[1];
	receiveSelect: TokenInputHook<CENNZAssetId>[0];
	receiveInput: TokenInputHook<CENNZAssetId>[1];
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

	const [exchangeSelect, exchangeInput] = useTokenInput(cennzAsset.assetId);
	const [receiveSelect, receiveInput] = useTokenInput(cpayAsset.assetId);

	const exchangeAsset = exchangeAssets?.find(
		(asset) => asset.assetId === exchangeSelect.tokenId
	);
	const receiveAsset = exchangeAssets?.find(
		(asset) => asset.assetId === receiveSelect.tokenId
	);

	const [slippage, setSlippage] = useState<string>("5");
	const [txStatus, setTxStatus] = useState<TxStatus>(null);

	const setProgressStatus = useCallback(() => {
		setTxStatus({
			status: "in-progress",
			title: "Transaction In Progress",
			message: (
				<div>
					Please sign the transaction when prompted and wait until it&apos;s
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
		const exValue = Balance.format(exchangeInput.value);
		const exSymbol = exchangeAsset.symbol;

		const reValue = Balance.format(receiveInput.value);
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
		exchangeInput.value,
		exchangeAsset.symbol,
		receiveInput.value,
		receiveAsset.symbol,
	]);

	return (
		<SwapContext.Provider
			value={{
				exchangeAssets,
				receiveAssets,
				setReceiveAssets,
				exchangeSelect,
				exchangeInput,
				receiveSelect,
				receiveInput,
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
