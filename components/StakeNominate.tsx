import { useEffect, useState, VFC } from "react";
import { css } from "@emotion/react";
import SelectInput from "@/components/shared/SelectInput";
import { useStake } from "@/providers/StakeProvider";
import { MenuItem, Theme } from "@mui/material";

const StakeNominate: VFC = () => {
	const { electionInfo } = useStake();
	const [options, setOptions] = useState<string[]>();
	const [selected, setSelected] = useState<string[]>();

	useEffect(() => {
		if (!electionInfo) return;

		setOptions(
			electionInfo.elected.info.map((info) => info.accountId.toHuman())
		);
	}, [electionInfo]);

	return (
		<div css={styles.root}>
			<label htmlFor="nominateOptions">nominate validators</label>
			<div css={[styles.select, styles.selectHover]}>
				<SelectInput
					css={styles.select}
					value={selected ?? []}
					onChange={(e) => setSelected(e.target.value as string[])}
				>
					{!!options &&
						options.map((account) => (
							<MenuItem key={account} value={account} css={styles.selectItem}>
								{account}
							</MenuItem>
						))}
				</SelectInput>
			</div>
		</div>
	);
};

export default StakeNominate;

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

	select: ({ palette }: Theme) => css`
		margin-bottom: 1.5em;
		width: 100%;
		border-radius: 4px;
		overflow: hidden;
		display: flex;
		align-items: center;
		transition: border-color 0.2s;
		position: relative;
		border: 1px solid ${palette.text.secondary};

		.MuiOutlinedInput-notchedOutline {
			border: none;
		}

		&:last-child {
			margin-bottom: 0;
		}
	`,

	selectHover: ({ palette }: Theme) => css`
		&:hover,
		&:focus {
			border-color: ${palette.primary.main};
		}
	`,

	selectItem: css`
		display: flex;
		align-items: center;
		padding-top: 0.75em;
		padding-bottom: 0.75em;

		font-size: 14px;
		font-weight: bold;
		flex: 1;
	`,
};
