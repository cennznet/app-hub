import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Autocomplete, TextField } from "@mui/material";
import { useWeb3Accounts } from "../../providers/Web3AccountsProvider";
import { useWallet } from "../../providers/SupportedWalletProvider";

const CENNZnetAccountPicker: React.FC<{
	updateSelectedAccount: Function;
	wallet?: boolean;
}> = ({ updateSelectedAccount, wallet }) => {
	const router = useRouter();
	const accounts = useWeb3Accounts();
	const [label, setLabel] = useState<string>();
	const [accountNames, setAccountNames] = useState<string[]>([]);
	const { selectedAccount } = useWallet();

	useEffect(() => {
		wallet ? setLabel("Switch Account") : setLabel("Destination");
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
				width: wallet ? "100%" : "80%",
			}}
			renderInput={(params) => (
				<TextField
					placeholder={selectedAccount?.meta.name}
					{...params}
					label={label}
					required={!wallet}
				/>
			)}
		/>
	);
};

export default CENNZnetAccountPicker;
