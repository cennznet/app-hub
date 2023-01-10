import { VFC } from "react";
import { css } from "@emotion/react";
import AddressInput from "@/libs/components/shared/AddressInput";
import { useStake } from "@/libs/providers/StakeProvider";
import { Theme } from "@mui/material";
import useAddressValidation from "@/libs/hooks/useAddressValidation";

const StakeDestinationInput: VFC = () => {
	const {
		stakeAction,
		stakeRewardDestination,
		setStakeRewardDestination,
		stakeControllerAccount,
		setStakeControllerAccount,
	} = useStake();
	const reward =
		stakeAction === "changeRewardDestination" || stakeAction === "newStake";
	const controller =
		stakeAction === "newStake" || stakeAction === "changeController";

	const { inputRef: rewardDestinationRef } = useAddressValidation(
		stakeRewardDestination,
		"CENNZnet"
	);

	const { inputRef: controllerAccountRef } = useAddressValidation(
		stakeControllerAccount,
		"CENNZnet"
	);

	return (
		<div css={styles.root}>
			{controller && (
				<div css={styles.input}>
					<label htmlFor="stake controller input">controller account</label>
					<AddressInput
						id="stakeControllerInput"
						value={stakeControllerAccount ?? ""}
						onChange={(event) => setStakeControllerAccount(event.target.value)}
						addressType="CENNZnet"
						ref={controllerAccountRef}
						placeholder="Enter CENNZnet address"
					/>
				</div>
			)}
			{reward && (
				<div css={styles.input}>
					<label htmlFor="stake reward destination input">
						reward destination
					</label>
					<AddressInput
						id="stakeRewardDestinationInput"
						value={stakeRewardDestination ?? ""}
						onChange={(event) => setStakeRewardDestination(event.target.value)}
						addressType="CENNZnet"
						ref={rewardDestinationRef}
						placeholder="Enter CENNZnet address"
					/>
				</div>
			)}
		</div>
	);
};

export default StakeDestinationInput;

const styles = {
	root: ({ palette }: Theme) => css`
		label {
			text-transform: uppercase;
			font-weight: bold;
			font-size: 14px;
			margin-bottom: 0.5em;
			display: block;
			color: ${palette.primary.main};
		}
	`,

	input: css`
		margin-bottom: 1.5em;
	`,
};
