import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Autocomplete, TextField } from "@mui/material";
import { useWeb3Accounts } from "../../providers/Web3AccountsProvider";

const CENNZnetAccountPicker: React.FC<{
	updateSelectedAccount: Function;
}> = ({ updateSelectedAccount }) => {
	const router = useRouter();
	const accounts = useWeb3Accounts();
	const [label, setLabel] = useState<string>();
	const [accountNames, setAccountNames] = useState<string[]>([]);

	useEffect(() => {
		switch (router.asPath) {
			default:
			case "/liquidity":
				setLabel("Account");
				break;
			case "/bridge":
				setLabel("Destination");
				break;
		}
	}, [router.asPath]);

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
				updateSelectedAccount({
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
				width: "460px",
				mb: "77px",
			}}
			renderInput={(params) => <TextField {...params} label={label} required />}
		/>
	);
};

export default CENNZnetAccountPicker;
