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
import { CHAINS, getMetamaskBalance } from "../../utils/bridge/helpers";
import ExchangeIcon from "../../components/shared/ExchangeIcon";
import { useWallet } from "../../providers/SupportedWalletProvider";

const Emery: React.FC<{}> = () => {
	const [bridgeState, setBridgeState] = useState<BridgeState>("Withdraw");
	const [toChain, setToChain] = useState<Chain>(CHAINS[0]);
	const [fromChain, setFromChain] = useState<Chain>(CHAINS[1]);
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
	const [estimatedFee, setEstimatedFee] = useState(0);

	useEffect(() => {
		if (!api?.isConnected) {
			initApi();
		}
	}, [api, initApi]);

	useEffect(() => {
		getBridgeBalances(selectedAccount?.address);
	}, [selectedAccount, api]);

	useEffect(() => {
		if (!toChain) return;
		if (toChain.name === "Cennznet") {
			setBridgeState("Deposit");
		} else {
			setBridgeState("Withdraw");
		}
	}, [toChain, fromChain]);

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
					setOppositeChain={setToChain}
					initialChain={"Ethereum"}
					forceChain={fromChain.name}
					topText={"FROM"}
				/>
				<ExchangeIcon
					onClick={() => {
						setFromChain(toChain);
					}}
					horizontal={true}
				/>
				<ChainPicker
					setChain={setToChain}
					setOppositeChain={setFromChain}
					initialChain={"Cennznet"}
					forceChain={toChain.name}
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
					wrappedERC20Balance={bridgeState === "Withdraw"}
					width={"460px"}
				/>
			</div>
			<CENNZnetAccountPicker
				updateSelectedAccount={updateSelectedAccountCustom}
				topText={"DESTINATION"}
			/>
			<div className={styles.infoBoxContainer}>
				<p className={styles.infoBoxText}>
					{bridgeState === "Withdraw" ? (
						<div className={styles.feeContainer}>
							<p>{"Estimated Withdrawal Fee:"}</p>
							{estimatedFee + " ETH"}
						</div>
					) : (
						<div>
							<p>
								You will be awarded with <mark>X CPAY</mark> on your first
								transaction through the bridge!
							</p>
						</div>
					)}
				</p>
			</div>
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
					setEstimatedFee={setEstimatedFee}
				/>
			)}
		</div>
	);
};

export default Emery;
