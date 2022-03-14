import { FC } from "react";
import { Select, SelectProps, Theme } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { css } from "@emotion/react";

const SelectInput: FC<SelectProps> = (props) => {
	return (
		<Select
			{...props}
			MenuProps={{ sx: styles.selectDropdown as any }}
			IconComponent={ExpandMore}
			autoWidth={false}
		/>
	);
};

const styles = {
	root: css``,
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
