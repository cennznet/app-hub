import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { BridgedEthereumToken, EthereumToken } from "@/types";
import { Balance, fetchMetaMaskBalance } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { useWalletSelect } from "@/providers/WalletSelectProvider";

export default function useMetaMaskBalances(
	token1: EthereumToken | BridgedEthereumToken,
	token2?: EthereumToken | BridgedEthereumToken
): [Balance, Balance, () => void] {
	const { wallet, selectedAccount: metaMaskAccount } = useMetaMaskWallet();
	const { connectedChain } = useWalletSelect();
	const [balance1, setBalance1] = useState<Balance>(null);
	const [balance2, setBalance2] = useState<Balance>(null);

	const updateBalances = useMemo(() => {
		if (!wallet || !metaMaskAccount?.address || connectedChain !== "Ethereum")
			return;

		return async () => {
			setBalance1(null);
			fetchMetaMaskBalance(wallet, metaMaskAccount.address, token1).then(
				setBalance1
			);

			if (token2) {
				setBalance2(null);
				fetchMetaMaskBalance(wallet, metaMaskAccount.address, token2).then(
					setBalance2
				);
			}
		};
	}, [wallet, metaMaskAccount?.address, token1, token2, connectedChain]);

	useEffect(() => {
		void updateBalances?.();
	}, [updateBalances]);

	return [balance1, balance2, updateBalances];
}
