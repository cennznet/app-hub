import { FC } from "react";
import { css } from "@emotion/react";
import { Backdrop, BackdropProps } from "@mui/material";
import useSectionUri from "@/hooks/useSectionUri";
import { SectionUri } from "@/types";
import { Theme } from "@mui/material";

const ModalBackdrop: FC<BackdropProps> = (props) => {
	const section = useSectionUri();

	return <Backdrop {...props} css={styles.root(section)} />;
};

export default ModalBackdrop;

export const styles = {
	root:
		(section: SectionUri) =>
		({ palette }: Theme) =>
			css`
				background-color: ${palette.secondary[section]};
			`,
};
