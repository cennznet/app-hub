import { useCallback, FC, useRef, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { Divider, Theme, LinearProgress } from "@mui/material";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import AccountIdenticon from "@/components/shared/AccountIdenticon";
import { useCENNZExtension } from "@/providers/CENNZExtensionProvider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import getTokenLogo from "@/utils/getTokenLogo";
import { CENNZ_ASSET_ID, CPAY_ASSET_ID } from "@/constants";
import { useWalletProvider } from "@/providers/WalletProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { useSelectedAccount, useUpdateCENNZBalances } from "@/hooks";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

const Wallet: FC = () => {
	const {
		cennzBalances,
		setWalletOpen,
		walletOpen,
		selectedWallet,
		setSelectedWallet,
	} = useWalletProvider();
	const { selectAccount, disconnectWallet } = useCENNZWallet();
	const { accounts } = useCENNZExtension();
	const { selectedAccount: metaMaskAccount } = useMetaMaskWallet();
	const selectedAccount = useSelectedAccount();
	const updateCENNZBalances = useUpdateCENNZBalances();

	const onWalletDisconnect = useCallback(() => {
		setWalletOpen(false);
		setSelectedWallet(null);

		if (selectedWallet === "CENNZnet") disconnectWallet();
	}, [disconnectWallet, setWalletOpen, setSelectedWallet, selectedWallet]);

	const ref = useRef<HTMLDivElement>();
	const [balanceListHeight, setBalanceListHeight] = useState<number>(0);

	useEffect(() => {
		if (!walletOpen) return;
		updateCENNZBalances?.();
	}, [updateCENNZBalances, walletOpen]);

	useEffect(() => {
		if (!metaMaskAccount?.address) return;
		setBalanceListHeight(0);
	}, [metaMaskAccount?.address]);

	useEffect(() => {
		if (!walletOpen) return;
		const setListHeight = () => {
			const balanceList = ref.current;
			if (!balanceList || !cennzBalances?.length)
				return setBalanceListHeight(0);
			const rect = balanceList.getBoundingClientRect();
			setBalanceListHeight(rect.height);
		};

		const id = setTimeout(setListHeight, 500);
		setListHeight();

		return () => clearTimeout(id);
	}, [cennzBalances, walletOpen]);

	const onAccountSelect = useCallback(
		(event) => {
			setBalanceListHeight(0);
			selectAccount(
				accounts.find(({ address }) => event.target.value === address)
			);
		},
		[accounts, selectAccount]
	);

	if (!selectedAccount) return null;

	return (
		<div css={styles.modalContent}>
			<div css={styles.accountHeader}>
				<AccountIdenticon
					value={selectedAccount.address}
					theme="beachball"
					size={50}
				/>
				<div css={styles.accountDetails}>
					<div css={styles.accountName}>
						{(selectedAccount as InjectedAccountWithMeta)?.meta?.name ??
							"METAMASK"}
					</div>
					<div
						css={styles.accountAddress}
						onClick={() =>
							navigator.clipboard.writeText(
								selectedWallet === "CENNZnet"
									? selectedAccount.address
									: metaMaskAccount.address
							)
						}
					>
						{selectedWallet === "CENNZnet" &&
							selectedAccount.address
								.slice(0, 8)
								.concat("...", selectedAccount.address.slice(-8))}
						{selectedWallet === "MetaMask" &&
							metaMaskAccount.address
								.slice(0, 6)
								.concat("...", metaMaskAccount.address.slice(-4))}
					</div>
					{selectedWallet === "CENNZnet" && accounts?.length > 1 && (
						<div css={styles.switchAccount}>
							<select
								onChange={onAccountSelect}
								value={selectedAccount.address}
								css={styles.switchAccountSelect}
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
				</div>
			</div>
			<Divider />
			<LinearProgress
				css={styles.accountBalancesProgress(!balanceListHeight)}
			/>
			<div
				css={[
					styles.modalBody,
					css`
						height: ${balanceListHeight}px;
					`,
				]}
			>
				<div css={styles.accountBalances} ref={ref}>
					{!!cennzBalances?.length && (
						<>
							<div css={styles.balanceHeading}>Balance</div>

							<ul css={styles.balanceList}>
								{cennzBalances
									.filter(
										(asset) =>
											asset.value.gt(0) ||
											[CENNZ_ASSET_ID, CPAY_ASSET_ID].includes(asset.assetId)
									)
									.map((asset) => {
										const logo = getTokenLogo(asset.symbol);

										return (
											<li key={asset.assetId} css={styles.balanceItem}>
												<figure>
													{logo && (
														<img src={logo.src} alt={`${asset.symbol}-logo`} />
													)}
												</figure>
												<span>{asset.value.toBalance()}</span>
												<label>{asset.symbol}</label>
											</li>
										);
									})}
							</ul>
						</>
					)}
				</div>
			</div>
			<Divider />
			<nav css={styles.walletActions}>
				<span onClick={onWalletDisconnect}>Disconnect</span>
			</nav>
		</div>
	);
};

export default Wallet;

export const styles = {
	modalRoot: css`
		outline: none;
	`,

	modalContent: css`
		position: absolute;
		top: calc(4em + 48px);
		right: 3em;
		width: 400px;
		background-color: white;
		box-shadow: 4px 8px 8px rgba(17, 48, 255, 0.1);
		border-radius: 4px;
		outline: none;
	`,

	accountHeader: css`
		padding: 1.5em;
		display: flex;
		flex-direction: "row";
	`,

	accountDetails: css`
		margin-left: 1em;
		flex: 1;
	`,

	accountName: ({ palette }: Theme) => css`
		color: ${palette.primary.default};
		font-weight: bold;
		font-size: 24px;
		text-transform: uppercase;
	`,

	accountAddress: css`
		font-size: 14px;
		line-height: 1;
		opacity: 0.7;
		cursor: copy;
		font-family: "Roboto Mono", monospace;
	`,

	switchAccount: ({ palette }: Theme) => css`
		font-size: 14px;
		position: relative;
		margin-top: 0.25em;
		color: ${palette.primary.default};
	`,

	switchAccountSelect: css`
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

	modalBody: ({ transitions }: Theme) =>
		css`
			position: relative;
			height: 0;
			transition: height ${transitions.duration.standard}ms
				${transitions.easing.easeInOut};
			will-change: height;
			overflow: hidden;
		`,

	accountBalances: css`
		padding: 1em 1.5em 1.5em;
		position: relative;
	`,

	accountBalancesProgress:
		(show: boolean) =>
		({ transitions, palette }: Theme) =>
			css`
				height: 2px;
				border-radius: 2px;
				top: -1px;
				left: 0;
				opacity: ${show ? 1 : 0};
				transition: opacity ${transitions.duration.short}ms
					${transitions.easing.easeInOut};
				margin-bottom: -2px;
				transition-delay: ${show ? transitions.duration.standard : 0}ms;
				background-color: ${palette.secondary.default};
				.MuiLinearProgress-bar {
					background-color: ${palette.primary.default};
				}
			`,

	balanceHeading: css`
		font-weight: bold;
		margin-bottom: 0.5em;
	`,

	balanceList: css`
		list-style: none;
		padding: 0;
		margin: 0;
	`,

	balanceItem: css`
		margin-bottom: 0.75em;
		display: flex;
		align-items: center;
		font-family: "Roboto Mono", monospace;
		letter-spacing: -0.025em;

		&:last-child {
			margin-bottom: 0;
		}

		> figure {
			margin: 0 0.5em 0 0;
			width: 40px;
			height: 40px;
			padding: 8px;
			background-color: rgba(59, 59, 59, 0.1);
			display: block;
			border-radius: 3px;

			> img {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}

		> span {
			font-weight: bold;
			display: inline-block;
			margin-right: 0.5em;
		}
	`,

	balanceProgress: css`
		padding: 1.5em;
		text-align: center;
	`,

	balanceProgressVisual: css`
		height: 0.5em;
		border-radius: 0.5em;
	`,

	walletActions: ({ palette }: Theme) => css`
		padding: 1em 1.5em 1.5em;
		color: ${palette.grey["700"]};

		> span {
			transition: color 0.2s;
			cursor: pointer;
			&:hover {
				color: ${palette.primary.default};
			}
		}
	`,
};
