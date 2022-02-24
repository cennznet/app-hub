import { FC } from "react";
import styles from "@/styles/components/shared/ThreeDots.module.scss";

const ThreeDots: FC<{}> = () => {
	return (
		<div className={styles.root}>
			<span>.</span>
			<span>.</span>
			<span>.</span>
		</div>
	);
};

export default ThreeDots;
