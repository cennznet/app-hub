import React, { useState, useEffect, useRef } from "react";
import { useCENNZExtension } from "@/providers/CENNZExtensionProvider";
import { css } from "@emotion/react";
import AccountIdenticon from "@/components/shared/AccountIdenticon";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useBridge } from "@/providers/BridgeProvider";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import ClearIcon from "@mui/icons-material/Clear";

const AccountPicker: React.FC<{
	updateSelectedAccount: Function;
	topText: string;
	cennznet: boolean;
}> = ({ updateSelectedAccount, topText, cennznet }) => {
	const { accounts } = useCENNZExtension();
	const { selectedAccount } = useCENNZWallet();
	const { Account }: any = useBridge();
	const [selectedAccountInput, setSelectedAccountInput] = useState<string>();
	const [validAddress, setValidAddress] = useState<boolean>();
	const [error, setError] = useState<string>();
	const [isCleared, setIsCleared] = useState<boolean>(false);

	useEffect(() => {
		if (accounts) {
			updateSelectedAccount(accounts[0]);
			setSelectedAccountInput(accounts[0].address);
			setValidAddress(true);
		}
	}, []);

	useEffect(() => setError(""), [cennznet]);

	useEffect(() => {
		if (selectedAccount) {
			updateSelectedAccount({
				address: selectedAccount.address,
				name: selectedAccount.meta.name,
			});
			setSelectedAccountInput(selectedAccount.address);
			setValidAddress(true);
		}
	}, [selectedAccount]);

	const updateAccount = (accountAddress: string) => {
		setError("");
		setValidAddress(false);
		setIsCleared(false);
		//TODO improve address validation
		const cennznetAddressLength = 48;
		if (accountAddress.length === cennznetAddressLength) {
			updateSelectedAccount({
				name: "",
				address: accountAddress,
			});
			setValidAddress(true);
		} else if (accountAddress !== "") {
			setError("Invalid Cennznet Address");
		}
	};

	return (
		<div css={styles.accountPickerContainer}>
			<p css={styles.topText}>{topText}</p>
			<div css={styles.addressInputContainer}>
				{cennznet ? (
					validAddress ? (
						<AccountIdenticon
							theme="beachball"
							size={28}
							value={selectedAccountInput}
						/>
					) : (
						<img src={"/images/cennznet_blue.svg"} alt={""} />
					)
				) : (
					<Jazzicon diameter={30} seed={jsNumberForAddress(Account)} />
				)}
				<input
					type={"text"}
					placeholder={
						cennznet ? "Type Address" : Account ? Account : "Connect Wallet"
					}
					value={cennznet ? selectedAccountInput : Account}
					disabled={!cennznet}
					onChange={(e: any) => {
						setSelectedAccountInput(e.target.value);
						updateAccount(e.target.value);
					}}
				/>
				{cennznet && !isCleared && (
					<ClearIcon
						sx={{
							cursor: "pointer",
						}}
						onClick={() => {
							setSelectedAccountInput("");
							setValidAddress(false);
							setError("");
							updateSelectedAccount({
								name: "",
								address: "",
							});
							setIsCleared(true);
						}}
					/>
				)}
			</div>
			{error && <div css={styles.errorMsg}>{error}</div>}
		</div>
	);
};

export default AccountPicker;

export const styles = {
	accountPickerContainer: css`
		display: flex;
		flex-direction: column;
		margin-bottom: 32px;
	`,
	topText: css`
		font-style: normal;
		font-weight: bold;
		font-size: 14px;
		line-height: 125%;
		letter-spacing: 1.12428px;
		text-transform: uppercase;
		color: #020202;
		margin: 0;
		margin-bottom: 6px;
	`,
	addressInputContainer: css`
		width: 460px;
		height: 60px;
		background: #ffffff;
		border: 1px solid #979797;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0px 15px;

		input {
			margin-left: 10px;
			width: 85%;
			height: 100%;
			background: transparent;
			border: none;
			text-overflow: ellipsis;
			font-style: normal;
			font-weight: bold;
			font-size: 16px;
			line-height: 124%;
			&:focus-visible {
				outline: none;
			}
		}
	`,
	clearIcon: css`
		height: 24px;
		width: 24px;
		background: #1130ff;
		border-radius: 5px;
	`,
	errorMsg: css`
		color: #ec022c;
		font-weight: bold;
		font-size: 14px;
		line-height: 125%;
		text-transform: uppercase;
		margin: 0;
		margin-top: 12px;
		align-self: flex-end;
	`,
};
