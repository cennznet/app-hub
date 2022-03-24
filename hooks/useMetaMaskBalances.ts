import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { BridgedEthereumToken, EthereumToken } from "@/types";
import { Balance, fetchMetaMaskBalance } from "@/utils";
import { useEffect, useMemo, useState } from "react";

export default function useMetaMaskBalances(
	token1: EthereumToken | BridgedEthereumToken,
	token2?: EthereumToken | BridgedEthereumToken
): [Balance, Balance, () => void] {
	const { wallet, selectedAccount } = useMetaMaskWallet();
	const [balance1, setBalance1] = useState<Balance>(null);
	const [balance2, setBalance2] = useState<Balance>(null);

	const updateBalances = useMemo(() => {
		if (!wallet || !selectedAccount?.address) return;

		return async () => {
			fetchMetaMaskBalance(wallet, selectedAccount.address, token1).then(
				setBalance1
			);

			if (token2) {
				fetchMetaMaskBalance(wallet, selectedAccount.address, token2).then(
					setBalance2
				);
			}
		};
	}, [wallet, selectedAccount?.address, token1, token2]);

	useEffect(() => {
		updateBalances?.();
	}, [updateBalances]);

	return [balance1, balance2, updateBalances];
}
