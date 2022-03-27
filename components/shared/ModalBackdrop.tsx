import { FC } from "react";
import { css } from "@emotion/react";
import { Backdrop, BackdropProps } from "@mui/material";
import { Theme } from "@mui/material";

const ModalBackdrop: FC<BackdropProps> = (props) => {
	return <Backdrop {...props} css={styles.root} />;
};

export default ModalBackdrop;

export const styles = {
	root: ({ palette }: Theme) =>
		css`
			background-color: ${palette.secondary.main};
			opacity: 0.5 !important;
		`,
};
