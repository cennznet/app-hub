import { useCallback, useEffect, useState, VFC } from "react";
import { css } from "@emotion/react";
import { useStake } from "@/providers/StakeProvider";
import {
	Checkbox,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Theme,
	Tooltip,
} from "@mui/material";
import { Balance, extractNominators, getTokenLogo } from "@/utils";
import {
	ElectedCandidate,
	Result,
	Nominations,
	Option,
	StorageKey,
} from "@/types";
import { ETH_CHAIN_ID } from "@/constants";
import AccountIdenticon from "@/components/shared/AccountIdenticon";
import { poolRegistry } from "@/utils/poolRegistry";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
// import { DeriveHeartbeats } from "@polkadot/api-derive/types";
import StakeValidatorStatus from "@/components/StakeValidatorStatus";

const StakeValidatorTable: VFC = () => {
	const { api } = useCENNZApi();
	const { electionInfo, stakingAsset, setExtrinsic } = useStake();
	const [openAccount, setOpenAccount] = useState<string>();
	// const [recentlyOnline, setRecentlyOnline] = useState<DeriveHeartbeats>();
	const [nominatedBy, setNominatedBy] = useState<Result>();

	useEffect(() => {
		if (!api) return;

		// const fetchRecentlyOnline = async () =>
		// 	await api.derive.imOnline?.receivedHeartbeats();

		const fetchNominators = async () =>
			await api.query.staking.nominators.entries();

		// fetchRecentlyOnline().then((recent) => setRecentlyOnline(recent));

		fetchNominators().then(
			(nominatorsRaw: [StorageKey, Option<Nominations>][]) => {
				const nominators = extractNominators(nominatorsRaw);
				setNominatedBy(nominators);
			}
		);
	}, [api]);

	const chain = ETH_CHAIN_ID === 1 ? "CENNZnet Azalea" : "CENNZnet Nikau";

	const parseElectionBalance = useCallback(
		(amount) => {
			if (!stakingAsset) return;

			const electionBalance = new Balance(
				parseFloat(amount.replace(/,/g, "")),
				stakingAsset
			);

			return electionBalance.toPretty();
		},
		[stakingAsset]
	);

	const _renderRows = (electedInfo: ElectedCandidate[], isElected: boolean) => {
		return electedInfo.map((candidate) => {
			return (
				<TableRow key={candidate.accountId} css={styles.candidate}>
					{/* Account Identicon */}
					<TableCell>
						<Tooltip
							css={styles.accountTooltip}
							open={openAccount === candidate.accountId}
							title={candidate.accountId}
							placement="left"
							arrow
						>
							<div
								onMouseEnter={() => setOpenAccount(candidate.accountId)}
								onMouseLeave={() => setOpenAccount(null)}
							>
								<AccountIdenticon
									value={candidate.accountId}
									theme="beachball"
									size={40}
									css={styles.identicon}
								/>
							</div>
						</Tooltip>
					</TableCell>
					{/* Pool */}
					<TableCell>
						{poolRegistry[chain][candidate.accountId] ?? "Unknown"}
					</TableCell>
					{/* Commission */}
					<TableCell sx={{ textAlign: "center" }}>
						{candidate.validatorPrefs.commission}
					</TableCell>
					{/* Total Staked */}
					<TableCell>
						<p css={styles.number}>
							{parseElectionBalance(
								isElected
									? candidate.exposure.total
									: candidate.stakingLedger.active
							)}
						</p>
					</TableCell>
					{/* Status */}
					<TableCell>
						<StakeValidatorStatus
							isElected={isElected}
							nominators={nominatedBy?.[candidate.accountId] || []}
							// onlineCount={recentlyOnline?.[
							// 	candidate.accountId
							// ]?.blockCount.toNumber()}
							// hasMessage={recentlyOnline?.[candidate.accountId]?.hasMessage}
						/>
					</TableCell>
					{/* Nominate Checkbox */}
					<TableCell>
						<Checkbox
							css={styles.nominate}
							onClick={_validatorSelected}
							value={candidate.accountId}
						/>
					</TableCell>
				</TableRow>
			);
		});
	};

	const stashAddress = "5DVHuiWPrWomw1GxgXx6XuDCURPdDcv6YjLchobf156kwnZx";

	const [accountIdVec, setAccountIdVec] = useState<string[]>([]);
	const [isValid, setIsValid] = useState<boolean>(false);

	const _validatorSelected = (element: any): void => {
		const accountSelected: string = element.target.value;
		const accounts: string[] = accountIdVec;

		if (element.target.checked && accountSelected) {
			accounts.push(accountSelected);
		} else if (!element.target.checked && accounts.includes(accountSelected)) {
			const index = accounts.indexOf(accountSelected);

			if (index > -1) {
				accounts.splice(index, 1);
			}
		}

		setAccountIdVec(accounts);

		if (accounts.length !== 0 && stashAddress !== null) {
			setIsValid(true);
			setExtrinsic(api.tx.staking.nominate(accounts));
		} else {
			setIsValid(false);
		}
	};

	return (
		<div css={styles.root}>
			<div css={styles.labelContainer}>
				<label htmlFor="validators">validators</label>
				{!electionInfo && <LinearProgress css={[styles.infoProgress]} />}
			</div>
			<TableContainer css={[styles.container]}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell css={styles.tableHead}>Account</TableCell>
							<TableCell css={styles.tableHead}>Pool</TableCell>
							<TableCell css={styles.tableHead}>Commission</TableCell>
							<TableCell css={styles.tableHead} sx={{ textAlign: "center" }}>
								<div css={styles.totalStakedHead}>
									Total Staked
									<img
										src={getTokenLogo(stakingAsset.symbol).src}
										alt={stakingAsset.symbol}
									/>
								</div>
							</TableCell>
							<TableCell css={styles.tableHead}>Status</TableCell>
							<TableCell css={styles.tableHead}>Nominate</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{!!electionInfo?.elected &&
							_renderRows(
								electionInfo.elected.sort((a, b) =>
									parseFloat(a.exposure.total) < parseFloat(b.exposure.total)
										? 1
										: -1
								),
								true
							)}
						{!!electionInfo?.waiting &&
							_renderRows(
								electionInfo.waiting.sort((a, b) =>
									a.stakingLedger.active < b.stakingLedger.active ? 1 : -1
								),
								false
							)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default StakeValidatorTable;

const styles = {
	root: ({ palette }: Theme) => css`
		label {
			font-weight: bold;
			font-size: 14px;
			text-transform: uppercase;
			margin-bottom: 0.5em;
			display: block;
			color: ${palette.primary.main};
		}
	`,

	labelContainer: css`
		display: inline-flex;
	`,

	infoProgress: css`
		margin: 0.4em 0.5em;
		width: 25px;
		border-radius: 10px;
		opacity: 0.5;
		transition: opacity 0.2s;
	`,

	container: css`
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		overflow-y: auto;
		white-space: nowrap;
		max-height: 25em;
		min-width: 100%;
	`,

	tableHead: css`
		max-height: 2em;
		padding-bottom: -2em;
		text-align: center;
	`,

	totalStakedHead: css`
		display: inline-flex;

		img {
			margin-left: 0.5em;
			height: 1.6em;
		}
	`,

	candidate: css`
		text-align: center;
	`,

	number: css`
		font-family: "Roboto Mono", monospace;
	`,

	accountTooltip: ({ palette }: Theme) => css`
		color: ${palette.primary.main};
	`,

	identicon: css`
		margin-top: 0.5em;
		margin-left: 0.3em;
	`,

	status:
		(isElected: boolean) =>
		({ palette }: Theme) =>
			css`
				margin-top: 0.2em;
				margin-left: 0.3em;
				color: ${isElected ? palette.success.main : "#2DC8CB"};
			`,

	nominate: css`
		cursor: pointer;
		margin-left: 0.3em;
	`,
};
