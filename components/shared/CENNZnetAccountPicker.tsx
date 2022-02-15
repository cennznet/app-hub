import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Autocomplete, TextField } from "@mui/material";
import { useWeb3Accounts } from "../../providers/Web3AccountsProvider";

const CENNZnetAccountPicker: React.FC<{
	updateSelectedAccount: Function;
	wallet?: boolean;
}> = ({ updateSelectedAccount, wallet }) => {
	const router = useRouter();
	const accounts = useWeb3Accounts();
	const [placeholder, setPlaceholder] = useState<string>();
	const [accountNames, setAccountNames] = useState<string[]>([]);

	useEffect(() => {
		wallet ? setPlaceholder("Switch Account") : setPlaceholder("Destination");
	}, [router.asPath, wallet]);

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
			}
		});
	};

	return (
		<Autocomplete
			disablePortal
			options={accountNames}
			onSelect={(e: any) => updateAccount(e.target.value)}
			sx={{
				width: wallet ? "100%" : "460px",
				mb: wallet ? null : "77px",
			}}
			renderInput={(params) => (
				<TextField
					placeholder={placeholder}
					InputLabelProps={{ shrink: false }}
					{...params}
					required={!wallet}
				/>
			)}
		/>
	);
};

export default CENNZnetAccountPicker;
