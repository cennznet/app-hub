import React, { FC, useState } from "react";
import styles from "@/styles/components/shared/ExchangeIcon.module.css";
import { Box } from "@mui/material";

interface ExchangeIconProps {
	onClick: () => void;
	horizontal?: boolean;
	color?: string;
}

const ExchangeIconClass: FC<ExchangeIconProps> = ({
	onClick,
	horizontal = false,
	color = "#1130FF",
}) => {
	const [rotations, setRotations] = useState(1);
	return (
		<Box
			className={
				horizontal ? `${styles.horizontal} ${styles.exchangeIcon}` : styles.exchangeIcon
			}
			sx={{
				"&:hover": {
					fill: "white",
					background: color,
				},
			}}
			onClick={() => {
				setRotations(rotations + 1);
				onClick();
			}}
			id={"swapIcon"}
		>
			<svg
				id={"arrows"}
				className={styles.arrows}
				width="40"
				height="40"
				viewBox="0 0 37 40"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M10.6654 11L10.6654 31.4904"
					stroke={color}
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M9.96875 35.9375C10.25 36.2188 10.7188 36.2188 11 35.9375L17.0938 29.875C17.375 29.5625 17.375 29.0938 17.0938 28.8125L16.375 28.0938C16.0938 27.8125 15.625 27.8125 15.3125 28.0938L10.5 32.9062L5.65625 28.0938C5.34375 27.8125 4.875 27.8125 4.59375 28.0938L3.875 28.8125C3.59375 29.0938 3.59375 29.5625 3.875 29.875L9.96875 35.9375Z"
					fill={color}
				/>
				<path
					d="M26.3346 29L26.3346 8.5096"
					stroke={color}
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M27.0313 4.0625C26.75 3.78125 26.2813 3.78125 26 4.0625L19.9063 10.125C19.625 10.4375 19.625 10.9062 19.9063 11.1875L20.625 11.9062C20.9063 12.1875 21.375 12.1875 21.6875 11.9062L26.5 7.09375L31.3438 11.9062C31.6563 12.1875 32.125 12.1875 32.4063 11.9062L33.125 11.1875C33.4063 10.9062 33.4063 10.4375 33.125 10.125L27.0313 4.0625Z"
					fill={color}
				/>
			</svg>
		</Box>
	);
};

export default ExchangeIconClass;
