import React, { FC, useState } from "react";
import styled from "styled-components";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

interface ExchangeIconProps {
	onClick: () => void;
}

export interface ExchangeArrowProps {
	rotations: number;
}

const ExchangeIcon = styled(CompareArrowsIcon)<ExchangeArrowProps>`
	height: 30px;
	width: 30px;
	color: rgba(17, 48, 255, 0.3);
	font-size: 20px;
	line-height: 20px;
	text-align: center;
	cursor: pointer;
	transform: ${(props) =>
		props.rotations % 2 ? "rotate(-90deg) " : "rotate(90deg)"};
	-webkit-transform: ${(props) =>
		props.rotations % 2 ? "rotate(-90deg) " : "rotate(90deg)"};
	transition-duration: 0.7s;
	transition-property: transform;

	:hover {
		color: #1130ff;
	}
`;

const Container = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin: 30px;
	margin-bottom: -25px;
`;

const ExchangeIconClass: FC<ExchangeIconProps> = ({ onClick }) => {
	const [rotations, setRotations] = useState(1);
	return (
		<Container
			onClick={() => {
				setRotations(rotations + 1);
				onClick();
			}}
		>
			<ExchangeIcon rotations={rotations} icon={CompareArrowsIcon as any} />
		</Container>
	);
};

export default ExchangeIconClass;
