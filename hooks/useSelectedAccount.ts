import { useMemo } from "react";
import { cvmToAddress } from "@cennznet/types/utils";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { useWalletProvider } from "@/providers/WalletProvider";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

export default function useSelectedAccount(): Pick<
	InjectedAccountWithMeta,
	"address"
> {
	const { selectedAccount: CENNZAccount } = useCENNZWallet();
	const { selectedAccount: metaMaskAccount } = useMetaMaskWallet();
	const { selectedWallet } = useWalletProvider();

	return useMemo(() => {
		if (selectedWallet === "CENNZnet") return CENNZAccount;
		if (selectedWallet === "MetaMask" && !!metaMaskAccount?.address)
			return { address: cvmToAddress(metaMaskAccount.address) };
	}, [CENNZAccount, metaMaskAccount, selectedWallet]);
}
