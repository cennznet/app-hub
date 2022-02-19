import React, { FC, useState } from "react";
import { Box } from "@mui/material";
import { PoolColors } from "@/components/pool/PoolForm";

interface SwapIconProps {
	onClick: () => void;
	color: string;
}

const SwapIconClass: FC<SwapIconProps> = ({ onClick, color }) => {
	const [rotations, setRotations] = useState(1);
	return (
		<Box
			sx={{
				"height": "56px",
				"width": "56px",
				"fontSize": "20px",
				"lineHeight": "20px",
				"textAlign": "center",
				"cursor": "pointer",
				"transitionDuration": "0.7s",
				"transitionProperty": "transform",
				"&:hover": {
					opacity: 0.7,
				},
			}}
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
		</Box>
	);
};

export default SwapIconClass;
