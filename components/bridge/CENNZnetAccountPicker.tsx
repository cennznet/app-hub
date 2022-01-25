import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useWeb3Accounts } from "../../providers/Web3AccountsProvider";

const CENNZnetAccountPicker: React.FC<{
  updateSelectedAccount: Function;
}> = ({ updateSelectedAccount }) => {
  const accounts = useWeb3Accounts();
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
        width: "80%",
      }}
      renderInput={(params) => (
        <TextField {...params} label="Destination" required />
      )}
    />
  );
};

export default CENNZnetAccountPicker;
