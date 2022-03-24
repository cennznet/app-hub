import { useCallback, useEffect, useState, VFC } from "react";
import { IntrinsicElements, WithdrawClaim } from "@/types";
import { css } from "@emotion/react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Divider,
	Theme,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import fetchUnclaimedWithdrawals from "@/utils/fetchUnclaimedWithdrawals";
import { EthyEventId } from "@cennznet/types";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { withdrawETHSide } from "@/utils/bridge";
import { useBridge } from "@/providers/BridgeProvider";
import { defineTxModal } from "@/utils/bridge/modal";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import ThreeDots from "@/components/shared/ThreeDots";

interface BridgeAdvancedProps {
	setModal: Function;
	setModalOpen: Function;
}

const BridgeAdvanced: VFC<IntrinsicElements["div"] & BridgeAdvancedProps> = (
	props
) => {
	const { api } = useCENNZApi();
	const { selectedAccount } = useCENNZWallet();
	const { Contracts, Account }: any = useBridge();
	const { updateBalances } = useCENNZWallet();
	const [mounted, setMounted] = useState<boolean>(false);
	const [unclaimedWithdrawals, setUnclaimedWithdrawals] =
		useState<WithdrawClaim[]>();

	useEffect(() => {
		if (!api || !selectedAccount) return;

		setUnclaimedWithdrawals(null);
		setMounted(false);

		(async () => {
			const unclaimed: Awaited<ReturnType<typeof fetchUnclaimedWithdrawals>> =
				await fetchUnclaimedWithdrawals(selectedAccount.address, api);

			if (!!unclaimed) setUnclaimedWithdrawals(unclaimed);
			setMounted(true);
		})();
	}, [api, selectedAccount, setUnclaimedWithdrawals]);

	const submitHistoricalClaim = useCallback(
		async (unclaimed: WithdrawClaim) => {
			if (!api || !Account || !Contracts) return;

			const eventProof = await api.derive.ethBridge.eventProof(
				unclaimed.eventProofId as unknown as EthyEventId
			);

			const tx: TransactionResponse = await withdrawETHSide(
				unclaimed.rawAmount,
				eventProof,
				Account,
				unclaimed.tokenAddress,
				api,
				Contracts.bridge,
				Contracts.peg,
				eventProof.blockHash
			);
			props.setModal(
				defineTxModal("withdrawETHside", tx.hash, props.setModalOpen)
			);
			await tx.wait();
			props.setModal(defineTxModal("finished", "", props.setModalOpen));
			await updateBalances();
		},
		[api, Account, Contracts, updateBalances, props]
	);

	return (
		<div {...props} css={styles.root}>
			<Accordion css={[styles.accordion]}>
				<AccordionSummary
					css={styles.accordionSummary}
					expandIcon={<ExpandMore />}
				>
					Advanced
				</AccordionSummary>
				<AccordionDetails>
					<div css={styles.unclaimedWithdrawals}>
						{!mounted && (
							<span style={{ display: "inline-flex" }}>
								<p>Checking for UNclaimed withdrawals</p>
								<ThreeDots rootCss={styles.threeDots} />
							</span>
						)}
						{mounted && !unclaimedWithdrawals && (
							<p>No UNclaimed Withdrawals &nbsp;&#127881;</p>
						)}
						{mounted && unclaimedWithdrawals && (
							<>
								<p>UNclaimed Withdrawals: </p>
								{unclaimedWithdrawals.map((unclaimed, i) => (
									<div key={i}>
										<div css={styles.unclaimed}>
											<span style={{ display: "block" }}>
												<p>
													UNclaimed: {unclaimed.amount} {unclaimed.tokenSymbol}
												</p>
												<p>{unclaimed.expiry}</p>
											</span>

											<button
												css={styles.claimButton}
												onClick={() => submitHistoricalClaim(unclaimed)}
											>
												claim
											</button>
										</div>

										<Divider css={styles.unclaimedDivider} />
									</div>
								))}
							</>
						)}
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default BridgeAdvanced;

const styles = {
	root: css`
		margin-top: 1em;
		width: 90%;
	`,

	accordion: css`
		box-shadow: none;

		&:before {
			display: none;
		}
	`,

	accordionSummary: ({ palette }: Theme) => css`
		text-transform: uppercase;
		font-weight: bold;
		padding: 0;
		justify-content: flex-start;

		.MuiAccordionSummary-content {
			flex-grow: 0;
			margin: 0 !important;
		}

		.MuiAccordionSummary-content.Mui-expanded,
		.MuiAccordionSummary-expandIconWrapper.Mui-expanded {
			color: ${palette.primary.main};
		}
	`,

	unclaimedWithdrawals: css`
		margin-top: 1em;
		margin-bottom: 1em;
		display: block;

		p {
			font-weight: bold;
			font-size: 14px;
			display: block;
		}
	`,

	threeDots: css`
		align-self: center;
		margin-left: 0.2em;
	`,

	unclaimed: css`
		margin-bottom: 0.5em;
		display: flex;
		justify-content: space-between;
		align-items: center;

		p {
			font-family: "Roboto Mono", monospace;
			margin-bottom: 1em;
		}
	`,

	claimButton: ({ palette, transitions }: Theme) => css`
		display: inline-block;
		border-radius: 4px;
		height: 2em;
		width: 5em;
		//align-self: center;

		background-color: white;
		font-weight: bold;
		cursor: pointer;
		transition: background-color ${transitions.duration.short}ms,
			color ${transitions.duration.short}ms;

		font-size: 14px;
		text-transform: uppercase;
		border: 1px solid ${palette.primary.main};
		color: ${palette.primary.main};

		&:hover {
			background-color: ${palette.primary.main};
			color: white;
		}
	`,

	unclaimedDivider: css`
		margin-bottom: 1em;
	`,
};
