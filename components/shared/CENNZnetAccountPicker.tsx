import React, { useState, useEffect, useRef } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useWeb3Accounts } from "../../providers/Web3AccountsProvider";
import styles from "../../styles/components/shared/cennznetaccountpicker.module.css";

const CENNZnetAccountPicker: React.FC<{
	updateSelectedAccount: Function;
	wallet?: boolean;
	topText?: string;
	forceAddress?: string;
}> = ({ updateSelectedAccount, wallet, topText, forceAddress }) => {
	const accounts = useWeb3Accounts();
	const [selectedAccount, setSelectedAccount] = useState<string>();
	const [accountNames, setAccountNames] = useState<string[]>([]);
	const [error, setError] = useState<string>();

	useEffect(() => {
		let names: string[] = [];
		if (accounts) {
			accounts.map((account) => {
				names.push(account.meta.name);
			});
			if (forceAddress) setAccountNames([forceAddress]);
			else setAccountNames(names);
		}
	}, [accounts, forceAddress]);

	useEffect(() => {
		if (forceAddress) {
			setAccountNames([]);
			//set to default cennznet account
			updateSelectedAccount(accounts[0]);
		}
	}, [forceAddress]);

	const updateAccount = (accountName: string) => {
		setError("");
		let foundAccount = false;
		//Check if account name exist in lists of user accounts
		accounts.forEach((account) => {
			if (account.meta.name === accountName) {
				wallet
					? updateSelectedAccount(account)
					: updateSelectedAccount({
							name: account.meta.name,
							address: account.address,
					  });
				setSelectedAccount(account.meta.name);
				setError("");
				foundAccount = true;
				return;
			}
		});
		if (foundAccount || forceAddress) return;
		//else check if the account they entered is valid cennznet address
		//TODO improve address validation
		const cennznetAddressLength = 48;
		if (accountName.length === cennznetAddressLength) {
			setSelectedAccount(accountName);
			if (!accountNames.includes(accountName) && !wallet) {
				const newAccountNames = [...accountNames, accountName];
				setAccountNames(newAccountNames);
			}
		} else if (accountName !== "" && !wallet && !forceAddress) {
			setError("Invalid Cennznet Address");
		}
	};

	return (
		<div
			className={
				wallet
					? `${styles.accountPickerContainer} ${styles.walletContainer}`
					: styles.accountPickerContainer
			}
		>
			<p className={styles.topText}>{topText}</p>
			<Autocomplete
				disablePortal
				options={accountNames}
				onSelect={(e: any) => {
					setSelectedAccount(e.target.value);
					updateAccount(e.target.value);
				}}
				clearIcon={!wallet && <img src={"blue_minus.svg"} alt={""} />}
				onChange={(event, value, reason) => {
					if (reason === "clear") {
						updateAccount("");
						setSelectedAccount("");
						updateSelectedAccount({
							address: "",
							name: "",
						});
						setError("");
					}
				}}
				sx={{
					width: wallet ? "100%" : "460px",
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						label={
							selectedAccount
								? ""
								: wallet
								? "Switch Account"
								: forceAddress
								? forceAddress
								: "Select or Type Address"
						}
						InputLabelProps={{ shrink: false }}
						disabled={!!forceAddress}
					/>
				)}
			/>
			{error && <div className={styles.errorMsg}>{error}</div>}
		</div>
	);
};

export default CENNZnetAccountPicker;
