import React, { FC, useState } from "react";
import styles from "../../styles/components/swap/swapicon.module.css";

interface ExchangeIconProps {
	onClick: () => void;
}

const ExchangeIconClass: FC<ExchangeIconProps> = ({ onClick }) => {
	const [rotations, setRotations] = useState(1);
	return (
		<div
			className={styles.swapIcon}
			onClick={() => {
				setRotations(rotations + 1);
				onClick();
			}}
		>
			<img src={"arrows.svg"} alt={""} />
		</div>
	);
};

export default ExchangeIconClass;
