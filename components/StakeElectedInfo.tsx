import { useCallback, useEffect, useState, VFC } from "react";
import { css } from "@emotion/react";
import { useStake } from "@/providers/StakeProvider";
import AccountIdenticon from "@/components/shared/AccountIdenticon";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	LinearProgress,
	Theme,
} from "@mui/material";
import { Balance } from "@/utils";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { DeriveStakingQuery, ElectedOption, StakingElected } from "@/types";

const StakeElectedInfo: VFC = () => {
	const { electionInfo, stakingAsset } = useStake();
	const [elected, setElected] = useState<StakingElected>();
	const [electedExpanded, setElectedExpanded] = useState<boolean>(false);
	const [electedOption, setElectedOption] = useState<ElectedOption>();
	const [extraDisplayAddress, setExtraDisplayAddress] = useState<string>();

	useEffect(() => {
		if (!electionInfo) return;

		const electedInfoMap = parseElectedInfo(
			electionInfo.elected.info
		) as ElectedOption[];

		const nextElected = electionInfo.elected.nextElected.map((el) =>
			el.toHuman()
		);

		const validators = electionInfo.elected.validators.map((el) =>
			el.toHuman()
		);

		setElected({
			electedInfoMap,
			nextElected,
			validators,
		});
	}, [electionInfo]);

	useEffect(() => {
		if (!electedOption) return;
		const { accountId, stashId, controllerId } = electedOption;
		if (accountId === stashId && accountId === controllerId) return;

		if (accountId === stashId) {
			return setExtraDisplayAddress(`Controller: ${controllerId}`);
		}

		setExtraDisplayAddress(
			`Controller: ${electedOption.controllerId}\nStash: ${electedOption.stashId}`
		);
	}, [electedOption]);

	const parseElectedInfo = (electedInfo: DeriveStakingQuery[]) => {
		return electedInfo.map((info) => {
			const electedInfo = {};
			Object.keys(info).forEach((key) => {
				try {
					electedInfo[key] = info[key].toHuman();
				} catch (_) {}
			});
			return electedInfo;
		});
	};

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
			<Accordion
				css={styles.electedOption}
				expanded={electedExpanded}
				onChange={() => setElectedExpanded(!electedExpanded)}
			>
				<AccordionSummary
					css={styles.expandElected}
					expandIcon={<ExpandMore />}
				>
					Elected
				</AccordionSummary>
				<AccordionDetails>
					<div css={styles.elected}>
						{!!elected &&
							elected.electedInfoMap.map((info) => (
								<div
									key={info.accountId}
									onClick={() => setElectedOption(info)}
								>
									<AccountIdenticon
										value={info.accountId}
										theme="beachball"
										size={40}
										css={styles.electedAccount}
									/>
								</div>
							))}
						{!elected && <LinearProgress css={[styles.electedInfoProgress]} />}
					</div>
					{electedOption && (
						<div>
							<label
								htmlFor="electedOption"
								css={styles.electedLabel}
								onClick={() =>
									navigator.clipboard.writeText(electedOption?.accountId)
								}
							>
								{electedOption.accountId}
							</label>
							<div css={styles.electedDetail}>{extraDisplayAddress ?? ""}</div>
							<div css={styles.electedAmounts}>
								<div css={styles.electedDetail}>
									Active:&nbsp;
									<span>
										{parseElectionBalance(electedOption.stakingLedger.active)}
									</span>
									&nbsp;
									{stakingAsset.symbol}
								</div>
								<div css={styles.electedDetail}>
									Total:&nbsp;
									<span>
										{parseElectionBalance(electedOption.stakingLedger.total)}
									</span>
									&nbsp;
									{stakingAsset.symbol}
								</div>
							</div>
							<div css={styles.electedDetail}>
								commission:&nbsp;
								<span>{electedOption.validatorPrefs.commission}</span>
							</div>
						</div>
					)}
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default StakeElectedInfo;

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

	elected: css`
		width: 100%;
		display: inline-flex;
		justify-content: space-between;
		margin-bottom: 0.5em;
	`,

	electedSelect: css`
		width: auto;
	`,

	electedAccount: css`
		cursor: pointer !important;
	`,

	electedOption: css`
		margin-top: 1em;
		margin-bottom: 2em;
		box-shadow: none;
		transition: 1000ms ease-in-out;

		&:before {
			display: none;
		}
	`,

	electedDetail: css`
		display: -ms-inline-flexbox;
		text-transform: uppercase;
		font-size: 14px;
		margin-bottom: 0.5em;

		span {
			font-family: "Roboto Mono", monospace;
		}
	`,

	electedAmounts: css`
		display: block;
	`,

	electedLabel: css`
		cursor: copy;
	`,

	expandElected: ({ palette }: Theme) => css`
		text-transform: uppercase;
		font-weight: bold;
		padding: 0;
		justify-content: flex-start;
		margin-bottom: 0.5em;

		.MuiAccordionSummary-content {
			flex-grow: 0;
			margin: 0 !important;
		}

		.MuiAccordionSummary-content.Mui-expanded,
		.MuiAccordionSummary-expandIconWrapper.Mui-expanded {
			color: ${palette.primary.main};
		}
	`,

	electedInfoProgress: css`
		display: inline-block;
		width: 25px;
		border-radius: 10px;
		opacity: 0.5;
	`,
};
