import {
	InjectedExtension,
	InjectedAccountWithMeta,
} from "@polkadot/extension-inject/types";
import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import store from "store";
import { useCENNZExtension } from "@/providers/CENNZExtensionProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useAssets } from "@/providers/SupportedAssetsProvider";
import { hexToString } from "@polkadot/util";
import ERC20Tokens from "@/artifacts/erc20tokens.json";
import { AssetInfo } from "@/types";

export type BalanceInfo = AssetInfo & {
	value: number;
};

type WalletContext = {
	balances: Array<BalanceInfo>;
	selectedAccount: InjectedAccountWithMeta;
	wallet: InjectedExtension;
	connectWallet: (callback?: () => void) => Promise<void>;
	disconnectWallet: () => void;
	selectAccount: (account: InjectedAccountWithMeta) => void;
	bridgeBalances: Object;
	getBridgeBalances: Function;
	fetchAssetBalances: Function;
};

const SupportedWalletContext = createContext<WalletContext>({
	balances: null,
	selectedAccount: null,
	wallet: null,
	connectWallet: null,
	disconnectWallet: null,
	selectAccount: null,
	bridgeBalances: null,
	getBridgeBalances: null,
	fetchAssetBalances: null,
});

type ProviderProps = {};

export default function SupportedWalletProvider({
	children,
}: PropsWithChildren<ProviderProps>) {
	const { api } = useCENNZApi();
	const { promptInstallExtension, extension, accounts } = useCENNZExtension();
	const [wallet, setWallet] = useState<InjectedExtension>(null);
	const [selectedAccount, setAccount] = useState<InjectedAccountWithMeta>(null);
	const [bridgeBalances, setBridgeBalances] = useState<Object>();

	const connectWallet = useCallback(
		async (callback) => {
			if (!api) return;

			if (!extension) {
				callback?.();
				return promptInstallExtension();
			}

			callback?.();
			setWallet(extension);
			store.set("CENNZNET-EXTENSION", extension);
		},
		[promptInstallExtension, extension, api]
	);

	const disconnectWallet = useCallback(() => {
		store.remove("CENNZNET-EXTENSION");
		store.remove("CENNZNET-ACCOUNT");
		setWallet(null);
		setAccount(null);
		setBalances(null);
	}, []);

	const selectAccount = useCallback((account) => {
		setAccount(account);
		store.set("CENNZNET-ACCOUNT", account);
	}, []);

	const getBridgeBalances = useCallback(
		async (address: string) => {
			if (!api || !address) return;
			const assets = await (api.rpc as any).genericAsset.registeredAssets();
			const tokenMap = {};

			for (const asset of assets) {
				const [tokenId, { symbol, decimalPlaces }] = asset;
				// Generic assets
				if (hexToString(symbol.toJSON()) !== "")
					tokenMap[tokenId] = {
						symbol: hexToString(symbol.toJSON()),
						decimalPlaces: decimalPlaces.toNumber(),
					};
				else {
					// ERC20 Tokens
					let tokenAddress: any = await api.query.erc20Peg.assetIdToErc20(
						tokenId
					);
					tokenAddress = tokenAddress.toJSON();
					try {
						// Only fetch data for tokens on selected network
						for (const ERC20Token of ERC20Tokens.tokens) {
							const tokenChainId = store.get("token-chain-id");
							if (
								(ERC20Token.chainId === tokenChainId &&
									ERC20Token.address === tokenAddress) ||
								tokenAddress === "0x0000000000000000000000000000000000000000"
							) {
								const tokenSymbolOption = await api.query.erc20Peg.erc20Meta(
									tokenAddress
								);
								tokenMap[tokenId] = {
									symbol: hexToString(tokenSymbolOption.toJSON()[0]),
									decimalPlaces: decimalPlaces.toNumber(),
									address: tokenAddress,
								};
							}
						}
					} catch (err) {
						console.log(err.message);
					}
				}
			}
			const balanceSubscriptionArg = Object.keys(tokenMap).map(
				(tokenId, index) => {
					tokenMap[tokenId].index = index;
					return [tokenId, address];
				}
			);
			await api.query.genericAsset.freeBalance.multi(
				balanceSubscriptionArg,
				(balances) => {
					const userBalances = {};
					Object.keys(tokenMap).forEach((tokenId) => {
						const token = tokenMap[tokenId];
						const tokenBalance: any =
							Number(balances[token.index]) / Math.pow(10, token.decimalPlaces);
						if (tokenBalance > 0 && token.symbol !== "")
							userBalances[token.symbol] = {
								balance: tokenBalance,
								tokenId,
								decimalPlaces: token.decimalPlaces,
								address: token.address,
								symbol: token.symbol,
							};
					});
					setBridgeBalances(userBalances);
				}
			);
		},
		[api]
	);

	// 1. Restore the wallet from the store if it exists
	useEffect(() => {
		if (extension === null) return disconnectWallet();
		const storedWallet = store.get("CENNZNET-EXTENSION");
		if (!storedWallet) return;
		setWallet(extension);
	}, [extension, disconnectWallet]);

	// 2. Pick the right account once a `wallet` has been set
	useEffect(() => {
		if (!wallet || !accounts || !selectAccount) return;

		const storedAccount = store.get("CENNZNET-ACCOUNT");
		if (!storedAccount) return selectAccount(accounts[0]);

		const matchedAccount = accounts.find(
			(account) => account.address === storedAccount.address
		);
		if (!matchedAccount) return selectAccount(accounts[0]);

		selectAccount(matchedAccount);
	}, [wallet, accounts, selectAccount]);

	// 3. Fetch `account` balance
	const assets = useAssets();
	const [balances, setBalances] = useState<Array<BalanceInfo>>();
	const fetchAssetBalances = useCallback(async () => {
		if (!assets || !selectedAccount?.address || !api) return;
		const balances = (
			await api.query.genericAsset.freeBalance.multi(
				assets.map(({ id }) => [id, selectedAccount.address])
			)
		).map((balance, index) => {
			const asset = assets[index];
			return {
				...asset,
				rawValue: balance as any,
				value: (balance as any) / Math.pow(10, asset.decimals),
			};
		});

		setBalances(balances);
	}, [assets, selectedAccount?.address, api]);

	useEffect(() => {
		fetchAssetBalances();
	}, [fetchAssetBalances]);

	return (
		<SupportedWalletContext.Provider
			value={{
				balances,
				selectedAccount,
				wallet,
				connectWallet,
				disconnectWallet,
				selectAccount,
				bridgeBalances,
				getBridgeBalances,
				fetchAssetBalances,
			}}
		>
			{children}
		</SupportedWalletContext.Provider>
	);
}

export function useWallet(): WalletContext {
	return useContext(SupportedWalletContext);
}
