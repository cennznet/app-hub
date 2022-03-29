import { CENNZAsset, PoolAction, TxStatus } from "@/types";
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useState,
	useCallback,
	useEffect,
} from "react";
import {
	useTokenInput,
	TokenInputHook,
	usePoolExchangeInfo,
	PoolExchangeInfoHook,
	usePoolUserInfo,
	PoolUserInfoHook,
} from "@/hooks";
import { Balance } from "@/utils";
import { CENNZ_ASSET_ID, CPAY_ASSET_ID } from "@/constants";

type CENNZAssetId = CENNZAsset["assetId"];

interface PoolContextType extends PoolExchangeInfoHook, PoolUserInfoHook {
	poolAction: PoolAction;
	setPoolAction: Dispatch<SetStateAction<PoolAction>>;
	tradeAssets: CENNZAsset[];
	tradeAsset: CENNZAsset;

	tradeSelect: TokenInputHook<CENNZAssetId>[0];
	tradeInput: TokenInputHook<CENNZAssetId>[1];

	coreAsset: CENNZAsset;

	coreSelect: TokenInputHook<CENNZAssetId>[0];
	coreInput: TokenInputHook<CENNZAssetId>[1];

	slippage: string;
	setSlippage: Dispatch<SetStateAction<string>>;

	txStatus: TxStatus;
	setTxStatus: Dispatch<SetStateAction<TxStatus>>;

	setProgressStatus: () => void;
	setSuccessStatus: () => void;
	setFailStatus: (errorCode?: string) => void;
}

const PoolContext = createContext<PoolContextType>({} as PoolContextType);

interface PoolProviderProps {
	supportedAssets: CENNZAsset[];
}

const PoolProvider: FC<PoolProviderProps> = ({ supportedAssets, children }) => {
	const [tradeAssets] = useState<CENNZAsset[]>(
		supportedAssets.filter((asset) => asset.assetId !== CPAY_ASSET_ID)
	);
	const [poolAction, setPoolAction] = useState<PoolAction>("Add");

	const cennzAsset = supportedAssets?.find(
		(asset) => asset.assetId === CENNZ_ASSET_ID
	);
	const coreAsset = supportedAssets?.find(
		(asset) => asset.assetId === CPAY_ASSET_ID
	);

	const [tradeSelect, tradeInput] = useTokenInput(cennzAsset.assetId);
	const [coreSelect, coreInput] = useTokenInput(coreAsset.assetId);

	const tradeAsset = tradeAssets?.find(
		(asset) => asset.assetId === tradeSelect.tokenId
	);

	const { exchangeInfo, updatingExchangeInfo, updateExchangeRate } =
		usePoolExchangeInfo(tradeAsset, coreAsset);

	const { userInfo, updatingPoolUserInfo, updatePoolUserInfo } =
		usePoolUserInfo(tradeAsset, coreAsset);

	useEffect(() => {
		if (poolAction !== "Remove") return;
		updatePoolUserInfo();
	}, [poolAction, updatePoolUserInfo]);

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
		const trValue = Balance.format(tradeInput.value);
		const trSymbol = tradeAsset.symbol;

		const crValue = Balance.format(coreInput.value);
		const crSymbol = coreAsset.symbol;

		setTxStatus({
			status: "success",
			title: "Transaction Completed",
			message: (
				<div>
					You successfully {poolAction === "Remove" ? "withdrew" : "added"}{" "}
					<pre>
						<em>
							{trValue} {trSymbol}
						</em>
					</pre>{" "}
					and{" "}
					<pre>
						<em>
							{crValue} {crSymbol}
						</em>
					</pre>{" "}
					to the Liquidity Pool.
				</div>
			),
		});
	}, [
		tradeInput.value,
		tradeAsset.symbol,
		coreInput.value,
		coreAsset.symbol,
		poolAction,
	]);

	return (
		<PoolContext.Provider
			value={{
				poolAction,
				setPoolAction,
				tradeAssets,
				coreAsset,
				tradeAsset,
				tradeSelect,
				tradeInput,
				coreSelect,
				coreInput,

				exchangeInfo,
				updateExchangeRate,
				updatingExchangeInfo,

				userInfo,
				updatingPoolUserInfo,
				updatePoolUserInfo,

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
		</PoolContext.Provider>
	);
};

export default PoolProvider;

export const usePool = (): PoolContextType => {
	return useContext(PoolContext);
};
