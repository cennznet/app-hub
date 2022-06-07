import { useMemo } from "react";
import { cvmToAddress } from "@cennznet/types/utils";
import { useCENNZWallet } from "@/libs/providers/CENNZWalletProvider";
import { useMetaMaskWallet } from "@/libs/providers/MetaMaskWalletProvider";
import { useWalletProvider } from "@/libs/providers/WalletProvider";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

export default function useSelectedAccount(): Pick<
	InjectedAccountWithMeta,
	"address"
> {
	const { selectedAccount: cennzAccount } = useCENNZWallet();
	const { selectedAccount: metaMaskAccount } = useMetaMaskWallet();
	const { selectedWallet } = useWalletProvider();

	return useMemo(() => {
		if (selectedWallet === "CENNZnet") return cennzAccount;
		if (selectedWallet === "MetaMask" && !!metaMaskAccount?.address)
			return { address: cvmToAddress(metaMaskAccount.address) };
	}, [cennzAccount, metaMaskAccount, selectedWallet]);
}
