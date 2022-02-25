import React, { useCallback } from "react";
import { css } from "@emotion/react";
import { Box, Divider } from "@mui/material";
import { Heading, SmallText } from "@/components/StyledComponents";
import { useWallet } from "@/providers/SupportedWalletProvider";
import { formatBalance } from "@/utils";
import AccountIdenticon from "@/components/shared/AccountIdenticon";
import { useCENNZExtension } from "@/providers/CENNZExtensionProvider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const AccountBalances: React.FC<{}> = ({}) => {
	const { balances, selectedAccount, selectAccount } = useWallet();
	const { accounts } = useCENNZExtension();
	const onAccountSelect = useCallback(
		(event) => {
			selectAccount(
				accounts.find(({ address }) => event.target.value === address)
			);
		},
		[accounts, selectAccount]
	);

	return (
		<>
			<Box sx={{ mt: "5%", pl: "5%", display: "flex", flexDirection: "row" }}>
				<AccountIdenticon
					value={selectedAccount.address}
					theme="beachball"
					size={50}
				/>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						ml: "1em",
					}}
				>
					<Heading
						sx={{
							color: "primary.main",
							fontSize: "16px",
							textTransform: "uppercase",
						}}
					>
						{selectedAccount?.meta?.name}
					</Heading>
					<SmallText
						sx={{ opacity: "70%", cursor: "copy", fontSize: "14px" }}
						onClick={() =>
							navigator.clipboard.writeText(selectedAccount.address)
						}
					>
						{selectedAccount.address
							.substring(0, 8)
							.concat(
								"...",
								selectedAccount.address.substring(
									selectedAccount.address.length - 8,
									selectedAccount.address.length
								)
							)}
					</SmallText>

					{accounts?.length > 1 && (
						<div css={styles.switchAccount}>
							<select
								onChange={onAccountSelect}
								value={selectedAccount.address}
								css={styles.swtichAccountSelect}
							>
								{accounts.map((acc, index) => (
									<option value={acc.address} key={index}>
										{acc.meta.name}
									</option>
								))}
							</select>
							<label css={styles.switchAccountLabel}>
								Switch account{" "}
								<KeyboardArrowDownIcon css={styles.keyboardDownIcon} />
							</label>
						</div>
					)}
				</Box>
			</Box>
			<Divider sx={{ m: "15px 0 15px" }} />
			<Heading sx={{ pl: "5%" }}>Balance</Heading>
			{balances?.length && (
				<Box sx={{ mt: "3%", pl: "5%", display: "block" }}>
					{balances.map(
						(token: any, i) =>
							token.value > 0 && (
								<Box
									key={i}
									sx={{
										display: "flex",
										height: "50px",
										verticalAlign: "center",
									}}
								>
									<Box sx={{ m: "10px 10px" }}>
										<img
											style={{ width: "40px", height: "40px" }}
											src={token.logo}
											alt={`${token.symbol}-logo`}
										/>
									</Box>
									<SmallText
										sx={{
											color: "black",
											fontWeight: "bold",
											fontSize: "18px",
											display: "inline-flex",
											mt: "18px",
										}}
									>
										{formatBalance(token.value)}
										&nbsp;
										<span
											style={{
												fontWeight: "normal",
												fontSize: "16px",
												letterSpacing: "0.5px",
											}}
										>
											{token.symbol}
										</span>
									</SmallText>
									<br />
								</Box>
							)
					)}
				</Box>
			)}
		</>
	);
};

export default AccountBalances;

export const styles = {
	switchAccount: ({ palette }: any) => css`
		font-size: 14px;
		position: relative;
		margin-top: 0.25em;
		color: ${palette.primary.main};
	`,

	swtichAccountSelect: css`
		cursor: pointer;
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
		left: 0;
		right: 0;
		z-index: 2;
	`,

	switchAccountLabel: css`
		display: flex;
		align-items: center;
	`,

	keyboardDownIcon: css`
		display: inline-block;
		width: 18px;
		height: 18px;
	`,
};
