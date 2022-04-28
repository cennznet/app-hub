import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { useWalletSelect } from "@/providers/WalletSelectProvider";
import { cvmToCENNZAddress } from "@/utils";
import { MetaMaskAccount } from "@/types";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { useMemo } from "react";

export default function useSelectedAccount():
	| InjectedAccountWithMeta
	| MetaMaskAccount {
	const { selectedAccount: CENNZAccount } = useCENNZWallet();
	const { selectedAccount: metaMaskAccount } = useMetaMaskWallet();
	const { selectedWallet } = useWalletSelect();

	return useMemo(() => {
		console.log({ selectedWallet, CENNZAccount });
		if (selectedWallet === "CENNZnet") return CENNZAccount;
		if (selectedWallet === "MetaMask" && !!metaMaskAccount?.address)
			return { address: cvmToCENNZAddress(metaMaskAccount.address) };
	}, [CENNZAccount, metaMaskAccount, selectedWallet]);
}
