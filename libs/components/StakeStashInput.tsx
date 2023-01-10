import { useCallback, VFC } from "react";
import { css } from "@emotion/react";
import AddressInput from "@/libs/components/shared/AddressInput";
import { useStake } from "@/libs/providers/StakeProvider";
import { Theme } from "@mui/material";
import useAddressValidation from "@/libs/hooks/useAddressValidation";

const StakeStashInput: VFC = () => {
	const { stakeAction, stashAddress, setStashAddress } = useStake();

	const { inputRef } = useAddressValidation(stashAddress, "CENNZnet");

	const onStashAddressChange = useCallback(
		(event) => {
			setStashAddress(event.target.value);
		},
		[setStashAddress]
	);

	return (
		<div css={styles.root}>
			{stakeAction === "stake" && (
				<div>
					<label htmlFor="stash address input">stash address</label>
					<AddressInput
						id="stakeStashAddressInput"
						value={stashAddress}
						onChange={onStashAddressChange}
						addressType="CENNZnet"
						ref={inputRef}
					/>
				</div>
			)}
		</div>
	);
};

export default StakeStashInput;

const styles = {
	root: ({ palette }: Theme) => css`
		margin-bottom: 1.5em;
		label {
			text-transform: uppercase;
			font-weight: bold;
			font-size: 14px;
			margin-bottom: 0.5em;
			display: block;
			color: ${palette.primary.main};
		}
	`,
};
