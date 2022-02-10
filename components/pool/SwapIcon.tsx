import React, { FC, useState } from "react";
import { PoolColors } from "./PoolForm";

interface SwapIconProps {
	onClick: () => void;
	color: string;
}

const SwapIconClass: FC<SwapIconProps> = ({ onClick, color }) => {
	const [rotations, setRotations] = useState(1);
	const [opacity, setOpacity] = useState(1);
	return (
		<div
			style={{
				height: "56px",
				width: "56px",
				fontSize: "20px",
				lineHeight: "20px",
				textAlign: "center",
				cursor: "pointer",
				transitionDuration: "0.7s",
				transitionProperty: "transform",
				opacity,
			}}
			onMouseOver={() => setOpacity(0.7)}
			onMouseOut={() => setOpacity(1)}
			onClick={() => {
				setRotations(rotations + 1);
				onClick();
			}}
		>
			<img
				src={
					color === PoolColors.ADD
						? "poolArrowsADD.svg"
						: "poolArrowsREMOVE.svg"
				}
				alt={""}
			/>
		</div>
	);
};

export default SwapIconClass;
