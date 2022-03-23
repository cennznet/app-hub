import { IntrinsicElements } from "@/types";
import { css } from "@mui/material";
import { VFC } from "react";

interface BridgeTokenDestinationProps {}

const BridgeTokenDestination: VFC<
	IntrinsicElements["div"] & BridgeTokenDestinationProps
> = (props) => {
	return <div {...props} css={styles.root}></div>;
};

export default BridgeTokenDestination;

const styles = {
	root: css``,
};
