import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Frame, Heading, SmallText } from "../../theme/StyledComponents";
import { useBlockchain } from "../../providers/BlockchainProvider";
import { useCENNZApi } from "../../providers/CENNZApiProvider";
import Switch from "../../components/bridge/Switch";
import Deposit from "../../components/bridge/Deposit";
import Withdraw from "../../components/bridge/Withdraw";

import styles from "../../styles/components/bridge/bridge.module.css";
import ChainPicker from "../../components/bridge/ChainPicker";
import { Chain, BridgeToken } from "../../types";
import TokenPicker from "../../components/shared/TokenPicker";
import ConnectWalletButton from "../../components/shared/ConnectWalletButton";
import { ETH, getMetamaskBalance } from "../../utils/bridge/helpers";
import { defineTxModal } from "../../utils/bridge/modal";
import { ethers } from "ethers";
import GenericERC20TokenAbi from "../../artifacts/GenericERC20Token.json";
import { decodeAddress } from "@polkadot/keyring";

const Emery: React.FC<{}> = () => {
	const [isDeposit, toggleIsDeposit] = useState<boolean>(true);
	const [toChain, setToChain] = useState<Chain>();
	const [fromChain, setFromChain] = useState<Chain>();
	const { Account } = useBlockchain();
	const { api, initApi } = useCENNZApi();
	const [amount, setAmount] = useState<string>("");
	const [erc20Token, setErc20Token] = useState<BridgeToken>();
	const [error, setError] = useState<string>();
	const [success, setSuccess] = useState<string>();

	useEffect(() => {
		if (!api?.isConnected) {
			initApi();
		}
	}, [api, initApi]);

	//Check MetaMask account has enough tokens to deposit if eth token picker
	useEffect(() => {
		setError("");
		const { ethereum }: any = window;
		if (!erc20Token) return;
		(async () => {
			let balance = await getMetamaskBalance(
				ethereum,
				erc20Token.address,
				Account
			);
			if (balance < parseFloat(amount)) {
				setError("Account Balance is too low");
			}
		})();
	}, [erc20Token, Account, amount]);

	return (
		<div className={styles.bridgeContainer}>
			<h1 className={styles.pageHeader}>BRIDGE</h1>
			<div className={styles.chainPickerContainer}>
				<ChainPicker setChain={setToChain} initialChain={"Cennznet"} />
				<ChainPicker setChain={setFromChain} initialChain={"Ethereum"} />
			</div>
			<TokenPicker
				setToken={setErc20Token}
				setAmount={setAmount}
				amount={amount}
				error={error}
			/>
			<Deposit token={erc20Token} amount={amount} />
			{/*{isDeposit ? <Deposit /> : <Withdraw />}*/}
		</div>
	);
};

export default Emery;
