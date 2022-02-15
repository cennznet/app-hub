import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useWeb3Accounts } from "../../providers/Web3AccountsProvider";
import styles from "../../styles/components/shared/cennznetaccountpicker.module.css";

const CENNZnetAccountPicker: React.FC<{
	updateSelectedAccount: Function;
	wallet?: boolean;
	forceAddress?: string;
}> = ({ updateSelectedAccount, wallet }) => {
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
			setAccountNames(names);
		}
	}, [accounts]);

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
		if (foundAccount) return;
		//else check if the account they entered is valid cennznet address
		//TODO improve address validation
		const cennznetAddressLength = 48;
		if (accountName.length === cennznetAddressLength) {
			setSelectedAccount(accountName);
			if (!accountNames.includes(accountName)) {
				const newAccountNames = [...accountNames, accountName];
				setAccountNames(newAccountNames);
			}
		} else if (accountName !== "") {
			setError("Invalid Cennznet Address");
		}
	};

	return (
		<div className={styles.accountPickerContainer}>
			<p className={styles.topText}>DESTINATION</p>
			<Autocomplete
				disablePortal
				options={accountNames}
				onSelect={(e: any) => {
					setSelectedAccount(e.target.value);
					updateAccount(e.target.value);
				}}
				clearIcon={<img src={"blue_minus.svg"} alt={""} />}
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
					mb: wallet ? null : "77px",
				}}
				renderInput={(params) => (
					<TextField
						placeholder={"placeholder"}
						{...params}
						label={selectedAccount ? "" : "Select or Type Address"}
						InputLabelProps={{ shrink: false }}
						required={!wallet}
					/>
				)}
			/>
			{error && <div className={styles.errorMsg}>{error}</div>}
		</div>
	);
};

export default CENNZnetAccountPicker;
