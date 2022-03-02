import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { useBridge } from "@/providers/BridgeProvider";
import Deposit from "@/components/bridge/Deposit";
import Withdraw from "@/components/bridge/Withdraw";
import CENNZnetAccountPicker from "@/components/shared/CENNZnetAccountPicker";
import ChainPicker from "@/components/bridge/ChainPicker";
import { Chain, BridgeToken, CENNZAccount, BridgeState } from "@/types";
import TokenPicker from "@/components/shared/TokenPicker";
import { CHAINS, fetchMetamaskBalance } from "@/utils/bridge";
import ExchangeIcon from "@/components/shared/ExchangeIcon";
import generateGlobalProps from "@/utils/generateGlobalProps";

export async function getStaticProps() {
	return {
		props: {
			...(await generateGlobalProps()),
		},
	};
}

const Emery: React.FC<{}> = () => {
	const [bridgeState, setBridgeState] = useState<BridgeState>("Deposit");
	const [toChain, setToChain] = useState<Chain>(CHAINS[0]);
	const [fromChain, setFromChain] = useState<Chain>(CHAINS[1]);
	const { Account } = useBridge();
	const [amount, setAmount] = useState<string>("");
	const [erc20Token, setErc20Token] = useState<BridgeToken>();
	const [error, setError] = useState<string>();
	const [selectedAccountCustom, updateSelectedAccountCustom] =
		useState<CENNZAccount>({
			address: "",
			name: "",
		});
	const [enoughBalance, setEnoughBalance] = useState<boolean>(false);
	const [estimatedFee, setEstimatedFee] = useState(0);

	useEffect(() => {
		if (!toChain) return;
		if (toChain.name === "CENNZnet") {
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
				if (!erc20Token || !Account) return;
				const balance = await fetchMetamaskBalance(
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
	}, [erc20Token, Account, amount, bridgeState]);

	useEffect(() => {
		if (!enoughBalance && parseFloat(amount) > 0)
			setError("Account balance is too low");
		else if (enoughBalance || parseFloat(amount) === 0) setError("");
	}, [enoughBalance, amount]);

	return (
		<div css={styles.bridgeContainer}>
			<h1 css={styles.pageHeader}>BRIDGE</h1>
			<div css={styles.chainPickerContainer}>
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
					initialChain={"CENNZnet"}
					forceChain={toChain.name}
					topText={"TO"}
				/>
			</div>
			<div>
				<div css={styles.tokenPickerTopContainer}>
					<p css={styles.tokenPickerTopText}>Select Token</p>
				</div>
				<TokenPicker
					setToken={setErc20Token}
					setAmount={setAmount}
					amount={amount}
					error={error}
					showBalance={true}
					withdrawBridge={bridgeState === "Withdraw"}
					width={"460px"}
				/>
			</div>
			<CENNZnetAccountPicker
				updateSelectedAccount={updateSelectedAccountCustom}
				topText={"DESTINATION"}
				forceAddress={bridgeState === "Withdraw" && Account}
			/>
			<div css={styles.infoBoxContainer}>
				<p css={styles.infoBoxText}>
					{bridgeState === "Withdraw" ? (
						<span css={styles.feeContainer}>
							Estimated Withdrawal Fee: {estimatedFee + " ETH"}
						</span>
					) : (
						<span>
							You will be awarded with <mark>5 CPAY</mark> on your first
							transaction through the bridge!
						</span>
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
					disabled={!Account || !(parseFloat(amount) > 0) || !enoughBalance}
					setEnoughBalance={setEnoughBalance}
					setEstimatedFee={setEstimatedFee}
				/>
			)}
		</div>
	);
};

export default Emery;

export const styles = {
	bridgeContainer: css`
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 550px;
		border-radius: 4px;
		margin: 0 auto 5em;
		position: relative;
		background-color: #ffffff;
		box-shadow: 4px 8px 8px rgba(17, 48, 255, 0.1);
		padding: 26px;
	`,
	pageHeader: css`
		font-weight: bold;
		font-size: 20px;
		line-height: 125%;
		text-align: center;
		letter-spacing: 1.12428px;
		text-transform: uppercase;
		color: #1130ff;
	`,
	chainPickerContainer: css`
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 42px;
	`,
	tokenPickerTopContainer: css`
		margin-bottom: 6px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	`,
	tokenPickerTopText: css`
		font-style: normal;
		font-weight: bold;
		font-size: 14px;
		line-height: 125%;
		letter-spacing: 1.12428px;
		text-transform: uppercase;
		text-align: left;
		color: #020202;
	`,
	infoBoxContainer: css`
		width: 460px;
		height: 95px;
		min-height: 95px;
		background: #e0f7f7;
		padding: 19px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 36px;
	`,
	infoBoxText: css`
		font-style: normal;
		font-weight: 600;
		font-size: 16px;
		line-height: 150%;
		color: #020202;
		text-align: left;

		mark {
			color: #1130ff;
			background: transparent;
		}
	`,
	feeContainer: css`
		display: flex;
		justify-content: center;
		align-items: center;

		p {
			color: #1130ff;
			margin-right: 5px;
		}
	`,
};
