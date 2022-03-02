import React, { useState, useEffect, useRef } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useCENNZExtension } from "@/providers/CENNZExtensionProvider";
import { css } from "@emotion/react";
import AccountIdenticon from "@/components/shared/AccountIdenticon";

const AccountPicker: React.FC<{
	updateSelectedAccount: Function;
	topText?: string;
	forceAddress?: string;
}> = ({ updateSelectedAccount, topText, forceAddress }) => {
	const { accounts } = useCENNZExtension();
	const [open, setOpen] = useState<boolean>(false);
	const [selectedAccount, setSelectedAccount] = useState<string>();
	const [cennzAccountAddress, setCennzAccountAddress] = useState<string[]>([]);
	const [error, setError] = useState<string>();

	useEffect(() => {
		let addresses: string[] = [];
		if (accounts) {
			accounts.map((account) => {
				addresses.push(account.address);
			});
			if (forceAddress) setCennzAccountAddress([forceAddress]);
			else setCennzAccountAddress(addresses);
		}
	}, [accounts, forceAddress]);

	useEffect(() => {
		if (!forceAddress || !accounts) return;
		setCennzAccountAddress([]);
		//set to default cennznet account
		updateSelectedAccount(accounts[0]);
	}, [forceAddress, accounts, updateSelectedAccount]);

	const updateAccount = (accountAddress: string) => {
		setError("");
		let foundAccount = false;
		//Check if account name exist in lists of user accounts
		accounts.forEach((account) => {
			if (account.address === accountAddress) {
				updateSelectedAccount({
					name: account.meta.name,
					address: account.address,
				});
				setSelectedAccount(account.address);
				setError("");
				foundAccount = true;
				return;
			}
		});
		if (foundAccount || forceAddress) return;
		//else check if the account they entered is valid cennznet address
		//TODO improve address validation
		const cennznetAddressLength = 48;
		if (accountAddress.length === cennznetAddressLength) {
			setSelectedAccount(accountAddress);
		} else if (accountAddress !== "" && !forceAddress) {
			setError("Invalid Cennznet Address");
		}
	};

	return (
		<div css={styles.accountPickerContainer}>
			<p css={styles.topText}>{topText}</p>
			<div css={styles.addressInputContainer}>
				<AccountIdenticon theme="beachball" size={28} value={selectedAccount} />
				<input
					type={"text"}
					placeholder={"Type Address"}
					value={selectedAccount}
					disabled={false}
					onChange={() => {}}
				/>
				<img src={"/images/blue_minus.svg"} alt={""} />
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
