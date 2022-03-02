import React, { useState, useEffect, useRef } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useCENNZExtension } from "@/providers/CENNZExtensionProvider";
import { css } from "@emotion/react";
import AccountIdenticon from "@/components/shared/AccountIdenticon";
import { useWallet } from "@/providers/SupportedWalletProvider";

const AccountPicker: React.FC<{
	updateSelectedAccount: Function;
	topText?: string;
	cennznet?: string;
}> = ({ updateSelectedAccount, topText }) => {
	const { accounts } = useCENNZExtension();
	const { selectedAccount } = useWallet();
	const [selectedAccountInput, setSelectedAccountInput] = useState<string>();
	const [error, setError] = useState<string>();

	useEffect(() => {
		if (accounts) {
			updateSelectedAccount(accounts[0]);
			setSelectedAccountInput(accounts[0].address);
		}
	}, []);

	useEffect(() => {
		if (selectedAccount) {
			updateSelectedAccount({
				address: selectedAccount.address,
				name: selectedAccount.meta.name,
			});
			setSelectedAccountInput(selectedAccount.address);
		}
	}, [selectedAccount]);

	const updateAccount = (accountAddress: string) => {
		setError("");
		//else check if the account they entered is valid cennznet address
		//TODO improve address validation
		const cennznetAddressLength = 48;
		if (accountAddress.length === cennznetAddressLength) {
			updateSelectedAccount({
				name: "",
				address: accountAddress,
			});
		} else if (accountAddress !== "") {
			setError("Invalid Cennznet Address");
		}
	};

	return (
		<div css={styles.accountPickerContainer}>
			<p css={styles.topText}>{topText}</p>
			<div css={styles.addressInputContainer}>
				{/*<div css={styles.defaultCircle} />*/}
				<AccountIdenticon
					theme="beachball"
					size={28}
					value={selectedAccountInput}
				/>
				<input
					type={"text"}
					placeholder={"Type Address"}
					value={selectedAccountInput}
					disabled={false}
					onChange={(e: any) => {
						setSelectedAccountInput(e.target.value);
						updateAccount(e.target.value);
					}}
				/>
				<img
					src={"/images/blue_minus.svg"}
					alt={""}
					onClick={() => {
						setSelectedAccountInput("");
						updateSelectedAccount({
							name: "",
							address: "",
						});
					}}
				/>
			</div>

			{/*<Autocomplete*/}
			{/*	disablePortal*/}
			{/*	open={open}*/}
			{/*	options={accountNames}*/}
			{/*	forcePopupIcon={!!!forceAddress}*/}
			{/*	onOpen={!!forceAddress ? null : () => setOpen(true)}*/}
			{/*	onClose={() => setOpen(false)}*/}
			{/*	onSelect={(e: any) => {*/}
			{/*		setSelectedAccount(e.target.value);*/}
			{/*		updateAccount(e.target.value);*/}
			{/*	}}*/}
			{/*	clearIcon={!wallet && <img src={"/images/blue_minus.svg"} alt={""} />}*/}
			{/*	onChange={(event, value, reason) => {*/}
			{/*		if (reason === "clear") {*/}
			{/*			updateAccount("");*/}
			{/*			setSelectedAccount("");*/}
			{/*			updateSelectedAccount({*/}
			{/*				address: "",*/}
			{/*				name: "",*/}
			{/*			});*/}
			{/*			setError("");*/}
			{/*		}*/}
			{/*	}}*/}
			{/*	sx={{*/}
			{/*		width: wallet ? "100%" : "460px",*/}
			{/*	}}*/}
			{/*	renderInput={(params) => (*/}
			{/*		<TextField*/}
			{/*			{...params}*/}
			{/*			label={*/}
			{/*				selectedAccount*/}
			{/*					? ""*/}
			{/*					: wallet*/}
			{/*					? "Switch Account"*/}
			{/*					: forceAddress*/}
			{/*					? forceAddress*/}
			{/*					: "Select or Type Address"*/}
			{/*			}*/}
			{/*			InputLabelProps={{ shrink: false }}*/}
			{/*			disabled={!!forceAddress}*/}
			{/*		/>*/}
			{/*	)}*/}
			{/*/>*/}
			{error && <div css={styles.errorMsg}>{error}</div>}
		</div>
	);
};

export default AccountPicker;

export const styles = {
	defaultCircle: css`
		border-radius: 50%;
		border: 3px solid blue;
		width: 32px;
		height: 30px;
	`,
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
		padding: 0px 20px;

		img {
			cursor: pointer;
			margin-left: 30px;
		}

		input {
			margin-left: 10px;
			width: 85%;
			height: 100%;
			background: transparent;
			border: none;
			text-overflow: ellipsis;
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
