import { FC } from "react";
import { css } from "@emotion/react";
import { IntrinsicElements } from "@/libs/types";
interface StakeOverviewProps {}

const StakeOverview: FC<IntrinsicElements["div"] & StakeOverviewProps> = ({
	children,
	...props
}) => {
	return (
		<div {...props} css={styles.root}>
			{children}
		</div>
	);
};

export default StakeOverview;

const styles = {
	root: css`
		width: 100%;
		position: relative;
	`,
};
