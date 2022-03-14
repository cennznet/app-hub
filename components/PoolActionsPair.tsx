import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { useCallback, useEffect, useState, VFC } from "react";
import SwitchButton from "@/components/shared/SwitchButton";
import { MenuItem } from "@mui/material";
import { usePool } from "@/providers/PoolProvider";
import SelectInput from "@/components/shared/SelectInput";

interface PoolActionsPairProps {}

const PoolActionsPair: VFC<IntrinsicElements["div"] & PoolActionsPairProps> = (
	props
) => {
	const selectOptions = [
		{
			value: "account",
			label: "Your account",
		},
		{
			value: "pool",
			label: "Liquidity Pool",
		},
	];

	const { setPoolAction } = usePool();
	const [fromOption, setFromOption] = useState<string>("account");
	const [toOption, setToOption] = useState<string>("pool");

	const setOptionsPair = useCallback((fromOption: string, toOption: string) => {
		if (fromOption) {
			setFromOption(fromOption);
			if (fromOption === "pool") return setToOption("account");
			if (fromOption === "account") return setToOption("pool");
		}

		if (toOption) {
			setToOption(toOption);
			if (toOption === "pool") return setFromOption("account");
			if (toOption === "account") return setFromOption("pool");
		}
	}, []);

	const onFromActionChange = useCallback(
		(event) => {
			setOptionsPair(event.target.value, null);
		},
		[setOptionsPair]
	);

	const onToActionChange = useCallback(
		(event) => {
			setOptionsPair(null, event.target.value);
		},
		[setOptionsPair]
	);

	const onSwitchClick = useCallback(() => {
		if (fromOption === "account") return setOptionsPair("pool", null);
		if (fromOption === "pool") return setOptionsPair("account", null);
	}, [fromOption, setOptionsPair]);

	useEffect(() => {
		if (fromOption === "account") return setPoolAction("Add");
		if (fromOption === "pool") return setPoolAction("Remove");
	}, [fromOption, setPoolAction]);

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				<div>
					<label htmlFor="fromSelect">From</label>
					<SelectInput
						id="fromSelect"
						css={styles.select}
						onChange={onFromActionChange}
						value={fromOption}
						inputProps={{ sx: styles.selectItem as any }}
					>
						{selectOptions.map((option, index) => {
							return (
								<MenuItem
									key={index}
									value={option.value}
									css={styles.selectItem}
								>
									<span>{option.label}</span>
								</MenuItem>
							);
						})}
					</SelectInput>
				</div>
				<SwitchButton css={styles.switchButton} onClick={onSwitchClick} />
				<div>
					<label htmlFor="toSelect">To</label>
					<SelectInput
						id="toSelect"
						css={styles.select}
						onChange={onToActionChange}
						value={toOption}
						inputProps={{ sx: styles.selectItem as any }}
					>
						{selectOptions.map((option, index) => {
							return (
								<MenuItem
									key={index}
									value={option.value}
									css={styles.selectItem}
								>
									<span>{option.label}</span>
								</MenuItem>
							);
						})}
					</SelectInput>
				</div>
			</div>
		</div>
	);
};

export default PoolActionsPair;

const styles = {
	root: css`
		margin-bottom: 1em;
	`,

	formField: css`
		margin-bottom: 1em;
		display: flex;
		align-items: flex-end;

		label {
			font-weight: bold;
			font-size: 0.875em;
			text-transform: uppercase;
			margin-bottom: 0.5em;
			display: block;
		}
	`,

	switchButton: css`
		margin: 0 1em;
	`,

	select: css`
		min-width: 200px;
		flex: 1;
	`,

	selectItem: css`
		display: flex;
		align-items: center;
		padding-top: 0.75em;
		padding-bottom: 0.75em;

		> span {
			text-transform: uppercase;
			font-size: 0.875em;
			font-weight: bold;
			flex: 1;
		}
	`,
};
