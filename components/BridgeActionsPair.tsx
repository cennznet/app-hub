import { IntrinsicElements } from "@/types";
import { css } from "@mui/material";
import { VFC } from "react";

interface BridgeActionsPairProps {}

const BridgeActionsPair: VFC<
	IntrinsicElements["div"] & BridgeActionsPairProps
> = (props) => {
	return <div {...props} css={styles.root}></div>;
};

export default BridgeActionsPair;

const styles = {
	root: css``,
};
