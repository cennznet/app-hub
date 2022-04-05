import {
	useCallback,
	useEffect,
	useState,
	VFC,
} from "react";
import { IntrinsicElements, WithdrawClaim } from "@/types";
import { css } from "@emotion/react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Divider,
	LinearProgress,
	Theme,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
	fetchUnclaimedWithdrawals,
	sendWithdrawEthereumRequest,
} from "@/utils";
import { EthyEventId } from "@cennznet/types";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useBridge } from "@/providers/BridgeProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { EthEventProof } from "@cennznet/api/derives/ethBridge/types";

interface BridgeAdvancedProps {}

const BridgeWithdrawAdvanced: VFC<IntrinsicElements["div"] & BridgeAdvancedProps> = ({...props}) => {
	const { api } = useCENNZApi();
	const { selectedAccount: CENNZAccount, updateBalances: updateCENNZBalances } =
		useCENNZWallet();
	const { selectedAccount: metaMaskAccount, wallet: metaMaskWallet } =
		useMetaMaskWallet();
	const {
		setProgressStatus,
		setSuccessStatus,
		setFailStatus,
		setTxStatus,
		updateMetaMaskBalances,
		transferInput,
		transferSelect,
		advancedExpanded: expanded,
		setAdvancedExpanded: setExpanded
	}: any = useBridge();
	const [mounted, setMounted] = useState<boolean>(false);
	const [unclaimedWithdrawals, setUnclaimedWithdrawals] =
		useState<WithdrawClaim[]>();
	const someUnclaimed = unclaimedWithdrawals?.length > 0;

	const updateUnclaimedWithdrawals = useCallback(async () => {
		if (!api || !CENNZAccount) return;
		setMounted(false);

		const unclaimed: Awaited<ReturnType<typeof fetchUnclaimedWithdrawals>> =
			await fetchUnclaimedWithdrawals(CENNZAccount.address, api);

		setUnclaimedWithdrawals(unclaimed.filter(Boolean));

		setMounted(true);
	}, [api, CENNZAccount]);

	useEffect(() => {
		if (expanded) void updateUnclaimedWithdrawals();
	}, [updateUnclaimedWithdrawals, expanded]);

	const processHistoricalRequest = useCallback(
		async (unclaimed: WithdrawClaim) => {
			if (!api || !metaMaskAccount || !metaMaskWallet) return;

			const historicalAmount = unclaimed.transferAmount.toInput();

			transferInput.setValue(historicalAmount);
			transferSelect.setTokenId(unclaimed.transferAsset.address);

			const eventProof: EthEventProof = await api.derive.ethBridge.eventProof(
				unclaimed.eventProofId as unknown as EthyEventId
			);

			let tx: Awaited<ReturnType<typeof sendWithdrawEthereumRequest>>;

			try {
				setProgressStatus("EthereumConfirming");
				tx = await sendWithdrawEthereumRequest(
					api,
					eventProof,
					unclaimed.transferAmount,
					unclaimed.transferAsset,
					metaMaskAccount.address,
					metaMaskWallet.getSigner(),
					eventProof.blockHash
				);
			} catch (error) {
				console.info(error);
				return setFailStatus(error?.code);
			}

			if (tx === "cancelled") return setTxStatus(null);

			setSuccessStatus(historicalAmount);
			transferInput.setValue("");
			updateMetaMaskBalances();
			updateCENNZBalances();
			await updateUnclaimedWithdrawals();
		},
		[
			api,
			metaMaskAccount,
			metaMaskWallet,
			setFailStatus,
			setProgressStatus,
			setSuccessStatus,
			setTxStatus,
			updateCENNZBalances,
			updateMetaMaskBalances,
			transferInput,
			transferSelect,
			updateUnclaimedWithdrawals,
		]
	);

	return (
		<div {...props} css={styles.root}>
			<Accordion
				css={[styles.accordion]}
				expanded={expanded}
				onChange={() => setExpanded(!expanded)}
			>
				<AccordionSummary
					css={styles.accordionSummary}
					expandIcon={<ExpandMore />}
				>
					Advanced
				</AccordionSummary>
				<AccordionDetails>
					<div css={styles.unclaimedWithdrawals}>
						{!mounted && <LinearProgress css={[styles.claimCheckProgress]} />}
						{mounted && !someUnclaimed && (
							<p>No UNclaimed Withdrawals &nbsp;&#127881;</p>
						)}
						{mounted && someUnclaimed && (
							<div>
								<p>UNclaimed Withdrawals: </p>
								{unclaimedWithdrawals.map((unclaimed, i) => (
									<div key={i}>
										<div css={styles.unclaimed}>
											<span style={{ display: "block" }}>
												<p>
													UNclaimed: {unclaimed.transferAmount.toInput()}{" "}
													{unclaimed.transferAsset.symbol}
												</p>
												<p>{unclaimed.expiry}</p>
											</span>

											<button
												css={styles.claimButton}
												onClick={() => processHistoricalRequest(unclaimed)}
												type="button"
											>
												claim
											</button>
										</div>

										<Divider css={styles.unclaimedDivider} />
									</div>
								))}
							</div>
						)}
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default BridgeWithdrawAdvanced;

const styles = {
	root: css`
		margin-top: 1em;
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

	claimCheckProgress: css`
		width: 25px;
		border-radius: 10px;
		opacity: 0.5;
		transition: opacity 0.2s;
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
