import { FC } from "react";
import { css } from "@emotion/react";
import useSectionUri from "@/hooks/useSectionUri";
import { SectionUri } from "@/types";

const PageFrame: FC<{}> = () => {
	const section = useSectionUri();
	return <div css={styles.container(section)} />;
};

export default PageFrame;

export const styles = {
	container:
		(section: SectionUri) =>
		({ palette }) =>
			css`
				position: fixed;
				inset: 0;
				z-index: 1000;
				pointer-events: none;
				border: 8px solid ${palette.primary[section]};
			`,
};
