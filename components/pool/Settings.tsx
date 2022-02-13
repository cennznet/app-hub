import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { SettingsText } from "../../theme/StyledComponents";
import PercentIcon from "@mui/icons-material/Percent";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const Settings: React.FC<{
	slippage: number;
	setSlippage: Function;
	coreAmount: number | string;
}> = ({ slippage, setSlippage, coreAmount }) => {
	const [open, setOpen] = useState<boolean>(false);
	const [infoOpen, setInfoOpen] = useState<boolean>(false);
	const [slippageValues, setSlippageValues] = useState({
		min: null,
		max: null,
	});

	useEffect(() => {
		if (!coreAmount || !slippage) return;

		const min = Number(coreAmount) * (1 - slippage / 100);
		const max = Number(coreAmount) * (1 + slippage / 100);
		setSlippageValues({ min, max });
	}, [coreAmount, slippage]);

	return (
		<>
			<Box sx={{ m: "30px", width: "468px" }}>
				<Box
					sx={{ display: "flex", flexDirection: "row", cursor: "pointer" }}
					onClick={() => {
						setOpen(!open);
						setInfoOpen(false);
					}}
				>
					<SettingsText>SETTINGS</SettingsText>
					<img
						alt="arrow"
						src={"/arrow_up.svg"}
						style={{
							marginLeft: "10px",
							transform: !open && "rotate(180deg)",
						}}
					/>
				</Box>

				{open && (
					<Box
						sx={{
							m: "20px auto",
						}}
					>
						<SettingsText>SLIPPAGE</SettingsText>
						<Box
							sx={{
								m: "10px auto",
								width: "auto",
								ml: 0,
								height: "auto",
								display: "flex",
								flexDirection: "row",
							}}
						>
							<input
								type="number"
								placeholder={String(slippage)}
								style={{
									width: "150px",
									height: "60px",
									fontSize: "16px",
									fontWeight: "bold",
									lineHeight: "16px",
									color: "#020202",
									border: "1px solid #979797",
									borderRight: "none",
									outline: "none",
									padding: "15px",
								}}
								onChange={(e) => setSlippage(Number(e.target.value))}
							/>
							<Box
								sx={{
									width: "40px",
									height: "60px",
									border: "1px solid #979797",
									display: "flex",
									alignItems: "center",
								}}
							>
								<PercentIcon sx={{ m: "0 auto", fontSize: "large" }} />
							</Box>
							<Box
								sx={{
									width: "40px",
									height: "60px",
									display: "flex",
									alignItems: "center",
									pl: "15px",
									cursor: "pointer",
								}}
								onClick={() => setInfoOpen(!infoOpen)}
							>
								<InfoOutlinedIcon
									sx={{
										fontSize: "25px",
										color: infoOpen ? "#1130FF" : "black",
									}}
								/>
							</Box>
							{infoOpen && (
								<Box
									sx={{
										border: "1px solid black",
										width: "228px",
										height: "auto",
										backgroundColor: "white",
										zIndex: +1,
										m: "-20px 0 0 15px",
									}}
								>
									<Typography
										sx={{
											m: "10px 8px 10px 8px",
											fontSize: "12px",
											lineHeight: "150%",
										}}
									>
										<span style={{ fontWeight: "bold" }}>Slippage</span>&nbsp;is
										the difference between the price you expect to get on the
										crypto you have ordered and the price you actually get when
										the transaction is sent
									</Typography>
								</Box>
							)}
						</Box>
						{!!coreAmount && (
							<Box
								sx={{
									width: "468px",
									height: "auto",
									mt: "30px",
									backgroundColor: "#F5ECFF",
									display: "flex",
								}}
							>
								<Typography
									sx={{
										fontSize: "16px",
										lineHeight: "150%",
										width: "90%",
										m: "10px auto",
									}}
								>
									If the amount of CPAY used sits outside{" "}
									<span style={{ fontWeight: "bold" }}>{slippage}%</span> <br />
									({slippageValues?.min}-{slippageValues?.max} CPAY),{" "}
									<span style={{ fontWeight: "bold" }}>
										the transaction will fail.
									</span>
								</Typography>
							</Box>
						)}
					</Box>
				)}
			</Box>
		</>
	);
};

export default Settings;
