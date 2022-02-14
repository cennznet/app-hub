import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useWeb3Accounts } from "../../providers/Web3AccountsProvider";
import styles from "../../styles/components/shared/cennznetaccountpicker.module.css";

const CENNZnetAccountPicker: React.FC<{
	updateSelectedAccount: Function;
	wallet?: boolean;
}> = ({ updateSelectedAccount, wallet }) => {
	const accounts = useWeb3Accounts();
	const [selectedAccount, setSelectedAccount] = useState<string>();
	const [accountNames, setAccountNames] = useState<string[]>([]);

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
		accounts.forEach((account) => {
			if (account.meta.name === accountName) {
				wallet
					? updateSelectedAccount(account)
					: updateSelectedAccount({
							name: account.meta.name,
							address: account.address,
					  });
				setSelectedAccount(account.meta.name);
			}
		});
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
				onChange={(event, value, reason) => {
					if (reason === "clear") {
						updateAccount("");
						setSelectedAccount("");
						updateSelectedAccount({
							address: "",
							name: "",
						});
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
						label={selectedAccount ? "" : "Enter Address"}
						InputLabelProps={{ shrink: false }}
						required={!wallet}
					/>
				)}
			/>
		</div>
	);
};

export default CENNZnetAccountPicker;
