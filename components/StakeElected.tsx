import { useCallback, useEffect, useState, VFC } from "react";
import { css } from "@emotion/react";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { Theme } from "@mui/system";
import { LinearProgress } from "@mui/material";
import { DeriveStakingOverview } from "@cennznet/api/derives/staking/types";
import { DeriveSessionProgress } from "@polkadot/api-derive/types";
import { useStake } from "@/providers/StakeProvider";

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

const StakeElected: VFC = () => {
	const { api } = useCENNZApi();
	const { spendingAsset } = useStake();
	const [mounted, setMounted] = useState<boolean>(false);
	const [validatorCount, setValidatorCount] = useState<string>();
	const [nextElectionIn, setNextElectionIn] = useState<number>();
	const [nextReward, setNextReward] = useState<number>();

	function parseStakingInfo<T, U>(rawInfo: T): U {
		const info = {} as U;
		Object.keys(rawInfo).forEach((key) => {
			try {
				info[key] = rawInfo[key].toJSON();
			} catch (err) {
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

		setNextElectionIn(progress.eraLength - progress.eraProgress);
	}, [api]);

	const fetchOverviewInfo = useCallback(async () => {
		if (!api) return;

		const fetchValidatorCount = async () => {
			const minimumValidatorCount =
				await api.query.staking.minimumValidatorCount();

			const overview = parseStakingInfo<DeriveStakingOverview, StakingOverview>(
				await api.derive.stakingCennznet.overview()
			);

			setValidatorCount(
				`${overview.validatorCount} / ${minimumValidatorCount}`
			);
		};

		const fetchNextReward = async () => {
			const transactionFeePot = (
				await api.query.rewards.transactionFeePot()
			).toJSON();
			const baseInflation = (
				await api.query.rewards.targetInflationPerStakingEra()
			).toJSON();

			setNextReward(Number(transactionFeePot) + Number(baseInflation));
		};

		await fetchValidatorCount();
		await fetchNextElectionIn();
		await fetchNextReward();
	}, [api, fetchNextElectionIn]);

	useEffect(() => {
		if (!validatorCount || !nextElectionIn) setMounted(false);

		fetchOverviewInfo().then(() => setMounted(true));

		const interval = setInterval(async () => await fetchNextElectionIn(), 5000);

		window.onunload = () => clearInterval(interval);
	}, [
		api,
		fetchOverviewInfo,
		fetchNextElectionIn,
		setMounted,
		validatorCount,
		nextElectionIn,
		nextReward,
	]);

	return (
		<div css={styles.root}>
			<div css={styles.overview}>
				{!mounted && <LinearProgress css={[styles.infoProgress]} />}
				<label htmlFor="validators">validators</label>
				<div css={styles.info}>
					{!!validatorCount && <span>{validatorCount}</span>}
				</div>
				<label htmlFor="validators">next election in</label>
				<div css={styles.info}>
					{!!nextElectionIn && <span>{nextElectionIn} blocks</span>}
				</div>
				<label htmlFor="rewards">next reward</label>
				<div css={styles.info}>
					{mounted && (
						<span>
							{nextReward} {spendingAsset.symbol}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default StakeElected;

const styles = {
	root: ({ palette }: Theme) => css`
		overflow-x: auto;
		overflow-y: hidden;
		white-space: nowrap;
		height: 30em;

		label {
			font-weight: bold;
			font-size: 14px;
			text-transform: uppercase;
			margin-bottom: 0.5em;
			display: block;
			color: ${palette.primary.main};
		}
	`,

	overview: css`
		display: -ms-inline-flexbox;
		width: 100%;
	`,

	infoProgress: css`
		width: 25px;
		float: right;
		margin: 0.5em 0.5em;
		border-radius: 10px;
		opacity: 0.5;
		display: block;
		transition: opacity 0.2s;
	`,

	info: css`
		margin-bottom: 1em;
	`,
};
