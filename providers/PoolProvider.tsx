import { CENNZAsset, PoolAction } from "@/types";
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useState,
	ReactElement,
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
import { CENNZ_ASSET_ID, CPAY_ASSET_ID } from "@/constants";
import { formatBalance } from "@/utils";

type CENNZAssetId = CENNZAsset["assetId"];

interface TxStatus {
	status: "in-progress" | "success" | "fail";
	title: string;
	message: string | ReactElement;
}

interface PoolContextType extends PoolExchangeInfoHook, PoolUserInfoHook {
	poolAction: PoolAction;
	setPoolAction: Dispatch<SetStateAction<PoolAction>>;
	tradeAssets: CENNZAsset[];
	tradeAsset: CENNZAsset;
	tradeToken: TokenInputHook<CENNZAssetId>[0];
	tradeValue: TokenInputHook<CENNZAssetId>[1];
	coreAsset: CENNZAsset;
	coreToken: TokenInputHook<CENNZAssetId>[0];
	coreValue: TokenInputHook<CENNZAssetId>[1];
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

	const [tradeToken, tradeValue] = useTokenInput(cennzAsset.assetId);
	const [coreToken, coreValue] = useTokenInput(coreAsset.assetId);

	const tradeAsset = tradeAssets?.find(
		(asset) => asset.assetId === tradeToken.tokenId
	);

	const {
		exchangeInfo,
		exchangeRate,
		updatingExchangeRate,
		updateExchangeRate,
	} = usePoolExchangeInfo(tradeAsset, coreAsset);

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
		const trValue = formatBalance(Number(tradeValue.value));
		const trSymbol = tradeAsset.symbol;

		const crValue = formatBalance(Number(coreValue.value));
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
		tradeValue.value,
		tradeAsset.symbol,
		coreValue.value,
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
				tradeToken,
				tradeValue,
				coreToken,
				coreValue,

				exchangeRate,
				exchangeInfo,
				updateExchangeRate,
				updatingExchangeRate,

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
