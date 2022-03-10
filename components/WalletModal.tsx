import { useCallback, FC, useRef, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { Modal, Divider, Theme, LinearProgress } from "@mui/material";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { formatBalance } from "@/utils";
import AccountIdenticon from "@/components/shared/AccountIdenticon";
import { useCENNZExtension } from "@/providers/CENNZExtensionProvider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import getTokenLogo from "@/utils/getTokenLogo";
import ModalBackdrop from "@/components/shared/ModalBackdrop";

const WalletModal: FC<{
	modalOpen: boolean;
	setModalOpen: Function;
}> = ({ setModalOpen, modalOpen }) => {
	const { balances, selectedAccount, selectAccount, disconnectWallet } =
		useCENNZWallet();
	const { accounts } = useCENNZExtension();

	const onWalletDisconnect = useCallback(() => {
		setModalOpen(false);
		disconnectWallet();
	}, [disconnectWallet, setModalOpen]);

	const ref = useRef<HTMLDivElement>();
	const [balanceListHeight, setBalanceListHeight] = useState<number>(0);

	useEffect(() => {
		if (!modalOpen) return;
		const id = setTimeout(() => {
			const balanceList = ref.current;
			const rect = balanceList.getBoundingClientRect();
			setBalanceListHeight(rect.height);
		}, 500);

		return () => clearTimeout(id);
	}, [balances, modalOpen]);

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
		<Modal
			open={modalOpen}
			css={styles.modalRoot}
			BackdropComponent={ModalBackdrop}
			onBackdropClick={() => setModalOpen(false)}
			onClose={() => setModalOpen(false)}
		>
			<div css={styles.modalContent}>
				<div css={styles.accountHeader}>
					<AccountIdenticon
						value={selectedAccount.address}
						theme="beachball"
						size={50}
					/>
					<div css={styles.accountDetails}>
						<div css={styles.accountName}>{selectedAccount?.meta?.name}</div>
						<div
							css={styles.accountAddress}
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
						</div>
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
						{!!balances?.length && (
							<>
								<div css={styles.balanceHeading}>Balance</div>

								<ul css={styles.balanceList}>
									{balances
										.filter((asset) => asset.value > 0)
										.map((asset) => {
											const logo = getTokenLogo(asset.symbol);

											return (
												<li key={asset.assetId} css={styles.balanceItem}>
													<figure>
														{logo && (
															<img
																src={logo.src}
																alt={`${asset.symbol}-logo`}
															/>
														)}
													</figure>
													<span>{formatBalance(asset.value)}</span>
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
		</Modal>
	);
};

export default WalletModal;

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
		flex: 1;0
	`,

	accountName: ({ palette }: any) => css`
		color: ${palette.primary.main};
		font-weight: bold;
		font-size: 24px;
		text-transform: uppercase;
	`,

	accountAddress: css`
		font-size: 14px;
		line-height: 1;
		opacity: 0.7;
		cursor: copy;
	`,

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
		({ transitions }: Theme) =>
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

	walletActions: ({ palette }) => css`
		padding: 1em 1.5em 1.5em;
		color: rgba(59, 59, 59, 0.75);

		> span {
			transition: color 0.2s;
			cursor: pointer;
			&:hover {
				color: ${palette.primary.main};
			}
		}
	`,
};
