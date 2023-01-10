import { useCallback, useEffect, useState, VFC } from "react";
import { css } from "@emotion/react";
import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import { Theme } from "@mui/system";
import { LinearProgress } from "@mui/material";
import { DeriveStakingOverview } from "@cennznet/api/derives/staking/types";
import { DeriveSessionProgress } from "@polkadot/api-derive/types";
import { useStake } from "@/libs/providers/StakeProvider";
import { Balance, getTokenLogo, numToPretty } from "@/libs/utils";
import CUBE from "@/libs/assets/vectors/cube.svg";

interface StakingOverview {
	activeEra: number;
	activeEraStart: number;
	currentEra: number;
	currentIndex: number;
	nextElected: any[];
	validatorCount: number;
	validators: string[];
}

interface StakingSessionProgress {
	activeEra: number;
	activeEraStart: number;
	currentEra: number;
	currentIndex: number;
	eraLength: number;
	eraProgress: number;
	isEpoch: boolean;
	sessionLength: number;
	sessionProgress: number;
	sessionsPerEra: number;
	validatorCount: number;
}

const StakeSummary: VFC = () => {
	const { api } = useCENNZApi();
	const { spendingAsset, electionInfo } = useStake();
	const [validatorCount, setValidatorCount] = useState<string>();
	const [nextElectionIn, setNextElectionIn] = useState<string>();
	const [nextReward, setNextReward] = useState<string>();
	const [nominators, setNominators] = useState<string>();

	function parseStakingInfo<T, U>(rawInfo: T): U {
		const info = {} as U;
		Object.keys(rawInfo).forEach((key) => {
			try {
				if (rawInfo[key].isArray()) {
					return (info[key] = rawInfo[key].map((item) => item.toJSON()));
				}
				info[key] = rawInfo[key].toJSON();
			} catch (_) {
				info[key] = rawInfo[key];
			}
		});
		return info;
	}

	const fetchNextElectionIn = useCallback(async () => {
		if (!api) return;

		const progress = parseStakingInfo<
			DeriveSessionProgress,
			StakingSessionProgress
		>(await api.derive.session.progress());

		setNextElectionIn(numToPretty(progress.eraLength - progress.eraProgress));
	}, [api]);

	const fetchNextReward = useCallback(async () => {
		if (!api || !spendingAsset) return;

		const transactionFeePot = (
			await api.query.rewards.transactionFeePot()
		).toJSON();
		const baseInflation = (
			await api.query.rewards.targetInflationPerStakingEra()
		).toJSON();

		const reward = new Balance(
			Number(transactionFeePot) + Number(baseInflation),
			spendingAsset
		);

		setNextReward(reward.toPretty());
	}, [api, spendingAsset]);

	const fetchOverviewInfo = useCallback(async () => {
		if (!api) return;

		const fetchValidatorCount = async () => {
			const validatorCount = await api.query.staking.validatorCount();

			const overview = parseStakingInfo<DeriveStakingOverview, StakingOverview>(
				await api.derive.stakingCennznet.overview()
			);

			setValidatorCount(`${overview.validators.length} / ${validatorCount}`);
		};

		const fetchNominators = async () => {
			const nominatorEntries = await api.query.staking.nominators.entries();

			setNominators(numToPretty(nominatorEntries.length));
		};

		await fetchValidatorCount();
		await fetchNextElectionIn();
		await fetchNextReward();
		await fetchNominators();
	}, [api, fetchNextElectionIn, fetchNextReward]);

	useEffect(() => {
		let interval: NodeJS.Timer;

		fetchOverviewInfo().then(() => {
			interval = setInterval(async () => await fetchNextElectionIn(), 5000);
		});

		window.onunload = () => clearInterval(interval);
	}, [
		api,
		fetchOverviewInfo,
		fetchNextElectionIn,
		validatorCount,
		nextElectionIn,
		nextReward,
	]);

	return (
		<div css={styles.root}>
			<div css={styles.overview}>
				<div css={styles.infoBlock}>
					<label htmlFor="validators">validators</label>
					<div css={styles.infoText}>
						{!!validatorCount ? (
							<span css={styles.number}>{validatorCount}</span>
						) : (
							<LinearProgress css={[styles.infoProgress]} />
						)}
					</div>
				</div>
				<div css={styles.infoBlock}>
					<label htmlFor="validators">next election in</label>
					<div css={styles.infoText}>
						{!!nextElectionIn ? (
							<span css={styles.number}>
								{nextElectionIn} <img src={CUBE.src} alt="cube" />
							</span>
						) : (
							<LinearProgress css={[styles.infoProgress]} />
						)}
					</div>
				</div>
				<div css={styles.infoBlock}>
					<label htmlFor="waiting">waiting</label>
					<div css={styles.infoText}>
						{!!electionInfo ? (
							<span>{electionInfo.waiting.length}</span>
						) : (
							<LinearProgress css={[styles.infoProgress]} />
						)}
					</div>
				</div>
				<div css={styles.infoBlock}>
					<label htmlFor="nominators">nominators</label>
					<div css={styles.infoText}>
						{!!nominators ? (
							<span css={styles.number}>{nominators}</span>
						) : (
							<LinearProgress css={[styles.infoProgress]} />
						)}
					</div>
				</div>
				<div css={styles.infoBlock}>
					<label htmlFor="rewards">next reward</label>
					<div css={styles.infoText}>
						{!!nextReward ? (
							<span css={styles.number}>
								{nextReward}{" "}
								<img
									src={getTokenLogo(spendingAsset?.symbol).src}
									alt={spendingAsset?.symbol}
								/>
							</span>
						) : (
							<LinearProgress css={[styles.infoProgress]} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default StakeSummary;

const styles = {
	root: ({ palette }: Theme) => css`
		label {
			font-weight: bold;
			font-size: 14px;
			text-align: center;
			text-transform: uppercase;
			margin-bottom: 0.5em;
			display: block;
			color: ${palette.primary.main};
		}
	`,

	overview: css`
		width: 100%;
		display: inline-flex;
		justify-content: space-between;
	`,

	infoProgress: css`
		width: 25px;
		margin-top: 0.5em;
		margin-bottom: 1em;
		border-radius: 10px;
		opacity: 0.5;
		display: block;
		transition: opacity 0.2s;
	`,

	infoBlock: css`
		margin-bottom: 1em;
		display: block;
	`,

	infoText: css`
		text-align: center;

		span {
			display: inline-flex;
		}

		img {
			margin-top: -0.2em;
			margin-left: 0.5em;
			height: 1.6em;
		}
	`,

	number: css`
		font-family: "Roboto Mono", monospace;
	`,
};
