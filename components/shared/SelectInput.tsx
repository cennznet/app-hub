import { FC } from "react";
import { Select, SelectProps, Theme } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { css } from "@emotion/react";

interface SelectInputProps {
	readOnly?: boolean;
}

const SelectInput: FC<SelectProps & SelectInputProps> = ({
	readOnly,
	...props
}) => {
	return (
		<Select
			{...props}
			css={[styles.root, readOnly && styles.rootReadOnly]}
			MenuProps={{ sx: styles.selectDropdown as any }}
			IconComponent={ExpandMore}
			autoWidth={false}
			disabled={readOnly}
		/>
	);
};

const styles = {
	root: css``,
	rootReadOnly: ({ palette }: Theme) => css`
		color: ${palette.text.primary} !important;
		.MuiSelect-select {
			-webkit-text-fill-color: unset;
		}

		.MuiSvgIcon-root {
			display: none;
		}
	`,

	selectDropdown: ({ palette, shadows }: Theme) => css`
		.MuiPaper-root {
			border-radius: 4px;
			overflow: hidden;
			transform: translate(-1px, 5px) !important;
			box-shadow: ${shadows[1]};
			border: 1px solid ${palette.secondary.main};
		}

		.MuiMenu-list {
			padding: 0;
		}
	`,
};

export default SelectInput;
