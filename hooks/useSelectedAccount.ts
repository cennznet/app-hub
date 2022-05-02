import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { useWalletProvider } from "@/providers/WalletProvider";
import { cvmToCENNZAddress } from "@/utils";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { useMemo } from "react";

export default function useSelectedAccount(): Partial<InjectedAccountWithMeta> {
	const { selectedAccount: CENNZAccount } = useCENNZWallet();
	const { selectedAccount: metaMaskAccount } = useMetaMaskWallet();
	const { selectedWallet } = useWalletProvider();

	return useMemo(() => {
		if (selectedWallet === "CENNZnet") return CENNZAccount;
		if (selectedWallet === "MetaMask" && !!metaMaskAccount?.address)
			return { address: cvmToCENNZAddress(metaMaskAccount.address) };
	}, [CENNZAccount, metaMaskAccount, selectedWallet]);
}