import { VFC } from "react";
import { css } from "@emotion/react";
import { useStake } from "@/providers/StakeProvider";
import { LinearProgress, Theme } from "@mui/material";
import { getTokenLogo } from "@/utils";

const StakeView: VFC = () => {
	const {
		stakeAction,
		stakingAsset,
		accountLedger,
		stakedBalance,
		unbondedBalance,
	} = useStake();

	return (
		<>
			{stakeAction === "viewStake" && (
				<div css={styles.root}>
					{accountLedger && (
						<>
							<div css={styles.info}>
								<label htmlFor="stash account">Stash</label>
								<span
									css={[styles.stash, styles.number]}
									onClick={() =>
										navigator.clipboard.writeText(accountLedger.stash)
									}
								>
									{accountLedger.stash}
								</span>
							</div>
							<div css={styles.info}>
								<label htmlFor="staked balance">Staked</label>
								<span>
									<span css={styles.number}>
										{stakedBalance ? stakedBalance.toBalance() : "0.0"}
									</span>
									<img
										src={getTokenLogo(stakingAsset.symbol).src}
										alt={stakingAsset.symbol}
									/>
								</span>
							</div>
							<div css={styles.info}>
								<label htmlFor="unbonded balance">Unbonded</label>
								<span>
									<span css={styles.number}>
										{unbondedBalance ? unbondedBalance.toBalance() : "0.0"}
									</span>
									<img
										src={getTokenLogo(stakingAsset.symbol).src}
										alt={stakingAsset.symbol}
									/>
								</span>
							</div>
						</>
					)}
					{!accountLedger && <LinearProgress css={styles.infoProgress} />}
				</div>
			)}
		</>
	);
};

export default StakeView;

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

		img {
			margin-left: 0.5em;
			margin-bottom: -0.4em;
			height: 1.6em;
		}
	`,

	info: css`
		margin-bottom: 1.5em;
	`,

	stash: css`
		cursor: copy;
	`,

	number: css`
		font-family: "Roboto Mono", monospace;
	`,

	infoProgress: css`
		width: 25px;
		border-radius: 10px;
		opacity: 0.5;
		transition: opacity 0.2s;
	`,
};
