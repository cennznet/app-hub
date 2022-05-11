import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { BridgedEthereumToken, EthereumToken } from "@/types";
import { Balance, fetchEthereumBalance } from "@/utils";
import { useEffect, useMemo, useState } from "react";

export default function useEthereumBalances(
	token1: EthereumToken | BridgedEthereumToken,
	token2?: EthereumToken | BridgedEthereumToken
): [Balance, Balance, () => void] {
	const { wallet, selectedAccount } = useMetaMaskWallet();
	const [balance1, setBalance1] = useState<Balance>(null);
	const [balance2, setBalance2] = useState<Balance>(null);

	const updateBalances = useMemo(() => {
		if (!wallet || !selectedAccount?.address) return;

		return async () => {
			setBalance1(null);
			fetchEthereumBalance(wallet, selectedAccount.address, token1).then(
				setBalance1
			);

			if (token2) {
				setBalance2(null);
				fetchEthereumBalance(wallet, selectedAccount.address, token2).then(
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
