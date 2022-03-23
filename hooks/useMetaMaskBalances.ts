import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { EthereumToken } from "@/types";
import { Balance, fetchMetaMaskBalance } from "@/utils";
import { useEffect, useState } from "react";

export default function useMetaMaskBalances(
	token1: EthereumToken,
	token2?: EthereumToken
): [Balance, Balance] {
	const { wallet, selectedAccount } = useMetaMaskWallet();
	const [balance1, setBalance1] = useState<Balance>(null);
	const [balance2, setBalance2] = useState<Balance>(null);

	useEffect(() => {
		if (!wallet || !selectedAccount?.address) return;

		fetchMetaMaskBalance(wallet, selectedAccount.address, token1).then(
			setBalance1
		);

		if (token2) {
			fetchMetaMaskBalance(wallet, selectedAccount.address, token2).then(
				setBalance2
			);
		}
	}, [wallet, selectedAccount?.address, token1, token2]);

	return [balance1, balance2];
}
