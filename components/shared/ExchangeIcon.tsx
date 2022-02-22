import React, { FC, useState } from "react";
import styles from "@/styles/components/shared/ExchangeIcon.module.css";

interface ExchangeIconProps {
	onClick: () => void;
	horizontal?: boolean;
}

const ExchangeIconClass: FC<ExchangeIconProps> = ({
	onClick,
	horizontal = false,
}) => {
	const [rotations, setRotations] = useState(1);
	return (
		<div
			className={
				horizontal
					? `${styles.horizontal} ${styles.exchangeIcon}`
					: styles.exchangeIcon
			}
			onClick={() => {
				setRotations(rotations + 1);
				onClick();
			}}
			id={"swapIcon"}
		>
			<img
				src={"arrows.svg"}
				alt={""}
				width={40}
				height={40}
				className={styles.arrows}
				id={"arrows"}
			/>
		</div>
	);
};

export default ExchangeIconClass;
