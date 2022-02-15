import React, { useEffect, useState } from "react";
import { useBlockchain } from "../../providers/BlockchainProvider";
import { useCENNZApi } from "../../providers/CENNZApiProvider";
import Deposit from "../../components/bridge/Deposit";
import Withdraw from "../../components/bridge/Withdraw";
import CENNZnetAccountPicker from "../../components/shared/CENNZnetAccountPicker";

import styles from "../../styles/components/bridge/bridge.module.css";
import ChainPicker from "../../components/bridge/ChainPicker";
import { Chain, BridgeToken, CennznetAccount, BridgeState } from "../../types";
import TokenPicker from "../../components/shared/TokenPicker";
import { getMetamaskBalance } from "../../utils/bridge/helpers";
import ExchangeIcon from "../../components/shared/ExchangeIcon";
import { useWallet } from "../../providers/SupportedWalletProvider";

const Emery: React.FC<{}> = () => {
	const [bridgeState, setBridgeState] = useState<BridgeState>("Withdraw");
	const [toChain, setToChain] = useState<Chain>();
	const [fromChain, setFromChain] = useState<Chain>();
	const { Account } = useBlockchain();
	const { api, initApi } = useCENNZApi();
	const { selectedAccount } = useWallet();
	const { getBridgeBalances } = useWallet();
	const [amount, setAmount] = useState<string>("");
	const [erc20Token, setErc20Token] = useState<BridgeToken>();
	const [error, setError] = useState<string>();
	const [selectedAccountCustom, updateSelectedAccountCustom] =
		useState<CennznetAccount>({
			address: "",
			name: "",
		});
	const [enoughBalance, setEnoughBalance] = useState<boolean>(false);

	useEffect(() => {
		if (!api?.isConnected) {
			initApi();
		}
	}, [api, initApi]);

	useEffect(() => {
		getBridgeBalances(selectedAccount?.address);
	}, [selectedAccount, api]);

	//Check MetaMask account has enough tokens to deposit if eth token picker
	useEffect(() => {
		if (bridgeState === "Deposit") {
			setError("");
			const { ethereum }: any = window;
			if (!erc20Token) return;
			(async () => {
				const balance = await getMetamaskBalance(
					ethereum,
					erc20Token.address,
					Account
				);
				if (balance < parseFloat(amount)) {
					setEnoughBalance(false);
				} else {
					setEnoughBalance(true);
				}
			})();
		}
	}, [erc20Token, Account, amount]);

	useEffect(() => {
		if (!enoughBalance && parseFloat(amount) > 0)
			setError("Account Balance is too low");
		else if (enoughBalance || parseFloat(amount) === 0) setError("");
	}, [enoughBalance, amount]);

	return (
		<div className={styles.bridgeContainer}>
			<h1 className={styles.pageHeader}>BRIDGE</h1>
			<div className={styles.chainPickerContainer}>
				<ChainPicker
					setChain={setFromChain}
					initialChain={"Cennznet"}
					topText={"FROM"}
				/>
				<ExchangeIcon onClick={() => {}} horizontal={true} />
				<ChainPicker
					setChain={setToChain}
					initialChain={"Ethereum"}
					topText={"TO"}
				/>
			</div>
			<div>
				<div className={styles.tokenPickerTopContainer}>
					<p className={styles.tokenPickerTopText}>Select Token</p>
				</div>
				<TokenPicker
					setToken={setErc20Token}
					setAmount={setAmount}
					amount={amount}
					error={error}
					showBalance={true}
					wrappedERC20Balance={true}
					width={"460px"}
				/>
			</div>
			<CENNZnetAccountPicker
				updateSelectedAccount={updateSelectedAccountCustom}
			/>
			{bridgeState === "Deposit" ? (
				<Deposit
					token={erc20Token}
					amount={amount}
					selectedAccount={selectedAccountCustom}
					disabled={
						!selectedAccountCustom?.address ||
						!(parseFloat(amount) > 0) ||
						!enoughBalance
					}
				/>
			) : (
				<Withdraw
					token={erc20Token}
					amount={amount}
					selectedAccount={selectedAccountCustom}
					disabled={
						!selectedAccountCustom?.address ||
						!(parseFloat(amount) > 0) ||
						!enoughBalance
					}
					setEnoughBalance={setEnoughBalance}
				/>
			)}
		</div>
	);
};

export default Emery;
