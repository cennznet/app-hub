import { IntrinsicElements } from "@/types";
import { css } from "@mui/material";
import { VFC } from "react";

interface BridgeStatsProps {}

const BridgeStats: VFC<IntrinsicElements["div"] & BridgeStatsProps> = (
	props
) => {
	return <div {...props} css={styles.root}></div>;
};

export default BridgeStats;

const styles = {
	root: css``,
};
