import { useBridge } from "@/providers/BridgeProvider";
import { IntrinsicElements } from "@/types";
import { css } from "@mui/material";
import { useCallback, useEffect, useState, FC, memo } from "react";
import SelectInput from "@/components/shared/SelectInput";
import SwitchButton from "@/components/shared/SwitchButton";
import { MenuItem, Theme } from "@mui/material";
import { useUpdateCENNZBalances } from "@/hooks";

interface BridgeActionsPairProps {}

const BridgeActionsPair: FC<
	IntrinsicElements["div"] & BridgeActionsPairProps
> = (props) => {
	const selectOptions = [
		{
			value: "Ethereum",
			label: "ETHEREUM",
		},
		{
			value: "CENNZnet",
			label: "CENNZnet",
		},
	];

	const { setBridgeAction, updateEthereumBalances } = useBridge();

	const [fromOption, setFromOption] = useState<string>("Ethereum");
	const [toOption, setToOption] = useState<string>("CENNZnet");

	const updateCENNZBalances = useUpdateCENNZBalances();

	const setOptionsPair = useCallback((fromOption: string, toOption: string) => {
		if (fromOption) {
			setFromOption(fromOption);
			if (fromOption === "Ethereum") return setToOption("CENNZnet");
			if (fromOption === "CENNZnet") return setToOption("Ethereum");
		}

		if (toOption) {
			setToOption(toOption);
			if (toOption === "Ethereum") return setFromOption("CENNZnet");
			if (toOption === "CENNZnet") return setFromOption("Ethereum");
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
		if (fromOption === "Ethereum") return setOptionsPair("CENNZnet", null);
		if (fromOption === "CENNZnet") return setOptionsPair("Ethereum", null);
	}, [fromOption, setOptionsPair]);

	useEffect(() => {
		if (fromOption === "Ethereum") return setBridgeAction("Deposit");
		if (fromOption === "CENNZnet") return setBridgeAction("Withdraw");
	}, [fromOption, setBridgeAction]);

	useEffect(() => {
		if (!fromOption) return;
		if (fromOption === "Ethereum") return updateEthereumBalances?.();
		if (fromOption === "CENNZnet") {
			void updateCENNZBalances?.();
			return;
		}
	}, [fromOption, updateEthereumBalances, updateCENNZBalances]);

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
		</div>
	);
};

export default memo(BridgeActionsPair);

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
			font-size: 14px;
			font-weight: bold;
			flex: 1;
		}
	`,
};
