import { useCallback, useEffect, useState, VFC } from "react";
import { css } from "@emotion/react";
import { useStake } from "@/providers/StakeProvider";
import {
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Theme,
} from "@mui/material";
import { Balance, getTokenLogo } from "@/utils";
import { DeriveStakingQuery, ElectedCandidate, StakingElected } from "@/types";
import { ETH_CHAIN_ID } from "@/constants";
import AccountIdenticon from "@/components/shared/AccountIdenticon";
import { poolRegistry } from "@/utils/poolRegistry";

const StakeElected: VFC = () => {
	const { electionInfo, stakingAsset } = useStake();
	const [mounted, setMounted] = useState<boolean>(false);
	const [elected, setElected] = useState<StakingElected>();

	const chain = ETH_CHAIN_ID === 1 ? "CENNZnet Azalea" : "CENNZnet Nikau";

	const parseElectedInfo = (electedInfo: DeriveStakingQuery[]) => {
		return electedInfo.map((info) => {
			const electedInfo = {};
			Object.keys(info).forEach((key) => {
				try {
					electedInfo[key] = info[key].toHuman();
				} catch (_) {
					electedInfo[key] = info[key];
				}
			});
			return electedInfo;
		});
	};

	useEffect(() => {
		if (!electionInfo) return setMounted(false);

		const electedInfoMap = parseElectedInfo(
			electionInfo.elected.info
		) as ElectedCandidate[];

		const nextElected = electionInfo.elected.nextElected.map((el) =>
			el.toHuman()
		);

		const validators = electionInfo.elected.validators.map((el) =>
			el.toHuman()
		);

		console.log("electedInfoMap", electedInfoMap);

		setElected({
			electedInfoMap,
			nextElected,
			validators,
		});

		setMounted(true);
	}, [electionInfo]);

	const parseElectionBalance = useCallback(
		(amount) => {
			if (!stakingAsset) return;

			return new Balance(
				parseFloat(amount.replace(/,/g, "")),
				stakingAsset
			).toInput();
		},
		[stakingAsset]
	);

	return (
		<div css={styles.root}>
			<label htmlFor="elected candidates">elected</label>
			<TableContainer css={[styles.container]}>
				{!mounted && <LinearProgress css={[styles.infoProgress]} />}
				<Table>
					<TableHead>
						<TableRow>
							<TableCell css={styles.tableHead}>Account</TableCell>
							<TableCell css={styles.tableHead}>Pool</TableCell>
							<TableCell css={styles.tableHead}>
								<div css={styles.stakingAssetHead}>
									Total Staked
									<img
										src={getTokenLogo(stakingAsset.symbol).src}
										alt={stakingAsset.symbol}
									/>
								</div>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{!!elected &&
							elected.electedInfoMap.map((candidate) => {
								const pool =
									chain &&
									poolRegistry[chain] &&
									poolRegistry[chain][candidate.accountId]
										? poolRegistry[chain][candidate.accountId]
										: "Unknown";

								return (
									<TableRow key={candidate.accountId} css={styles.candidate}>
										<TableCell>
											<AccountIdenticon
												value={candidate.accountId}
												theme="beachball"
												size={40}
												css={styles.identicon}
											/>
										</TableCell>
										<TableCell>{pool}</TableCell>
										<TableCell>
											<p css={styles.number}>
												{parseElectionBalance(candidate.stakingLedger.total)}
											</p>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default StakeElected;

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

	infoProgress: css`
		position: absolute;
		top: 6.5em;
		left: 26.5em;
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
		max-height: 20em;
		min-width: 100%;
	`,

	tableHead: css`
		max-height: 2em;
		padding-bottom: -2em;
	`,

	stakingAssetHead: css`
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

	identicon: css`
		margin-top: 0.5em;
		margin-right: 1em;
	`,
};
