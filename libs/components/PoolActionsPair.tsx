import { IntrinsicElements } from "@/libs/types";
import { css } from "@emotion/react";
import { useCallback, useEffect, useState, FC } from "react";
import { MenuItem, Theme } from "@mui/material";
import { usePool } from "@/libs/providers/PoolProvider";
import { SwitchButton, SelectInput } from "@/libs/components";

interface PoolActionsPairProps {}

const PoolActionsPair: FC<IntrinsicElements["div"] & PoolActionsPairProps> = (
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
				<div css={styles.selectInput}>
					<label htmlFor="fromSelect">From</label>
					<SelectInput
						id="fromSelect"
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
				<div css={styles.selectInput}>
					<label htmlFor="toSelect">To</label>
					<SelectInput
						id="toSelect"
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

			<div css={styles.formCopy}>
				<p>
					By adding liquidity you will earn <strong>0.3%</strong> of all trades
					on this pair proportional to your share of the pool. Accrued fees can
					be claimed at any time by withdrawing your liquidity.
				</p>
			</div>
		</div>
	);
};

export default PoolActionsPair;

const styles = {
	root: css`
		margin-bottom: 1.5em;
	`,

	formField: ({ palette }: Theme) => css`
		margin-bottom: 1em;
		display: flex;
		align-items: flex-end;

		label {
			font-weight: bold;
			font-size: 14px;
			text-transform: uppercase;
			margin-bottom: 0.5em;
			display: block;
			color: ${palette.primary.main};
		}
	`,

	switchButton: css`
		margin: 0 1em;
	`,

	selectInput: css`
		flex: 1;

		.MuiOutlinedInput-root {
			width: 100%;
		}
	`,

	selectItem: css`
		display: flex;
		align-items: center;
		padding-top: 0.75em;
		padding-bottom: 0.75em;

		> span {
			text-transform: uppercase;
			font-size: 14px;
			font-weight: bold;
			flex: 1;
		}
	`,

	formCopy: css`
		margin-bottom: 1.5em;
		font-size: 14px;
		p {
			margin-top: 0;
		}
	`,
};
