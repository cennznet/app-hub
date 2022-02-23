import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { SettingsText } from "@/components/StyledComponents";
import PercentIcon from "@mui/icons-material/Percent";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const Settings: React.FC<{
	slippage: number;
	setSlippage: Function;
	coreAmount: number | string;
	tokenName?: string;
	color?: string;
}> = ({ slippage, setSlippage, coreAmount, color, tokenName = "CPAY" }) => {
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
			<Box sx={{ mt: "30px", width: "468px", mb: open && "36px" }}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						cursor: "pointer",
						mb: open ? "35px" : "36px",
					}}
					onClick={() => {
						setOpen(!open);
						setInfoOpen(false);
					}}
				>
					<SettingsText>SETTINGS</SettingsText>
					<img
						alt="arrow"
						src={"/images/arrow_up.svg"}
						style={{
							marginLeft: "10px",
							transform: !open && "rotate(180deg)",
						}}
					/>
				</Box>

				{open && (
					<Box
						sx={{
							m: "0 auto",
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
								min={"1"}
								max={"10"}
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
							<ClickAwayListener onClickAway={() => setInfoOpen(false)}>
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
							</ClickAwayListener>
							{infoOpen && (
								<Box
									sx={{
										position: "absolute",
										left: "52%",
										top: "64.8%",
										border: "1px solid #979797",
										boxSizing: "border-box",
										width: "228px",
										height: "auto",
										backgroundColor: "white",
										zIndex: +1,
										boxShadow: "4px 8px 8px rgba(17, 48, 255, 0.1)",
									}}
								>
									<Typography
										sx={{
											m: "10px 10px 10px 10px",
											fontSize: "13px",
											lineHeight: "150%",
										}}
									>
										<span style={{ fontWeight: "bold" }}>Slippage</span>
										&nbsp;is the difference between the price you expect to get
										on the crypto you have ordered and the price you actually
										get when the transaction is sent.
									</Typography>
								</Box>
							)}
						</Box>
						<Box
							sx={{
								width: "468px",
								height: "auto",
								mt: "30px",
								backgroundColor: color ? color : "#F5ECFF",
								display: "flex",
							}}
						>
							<Typography
								sx={{
									fontSize: "16px",
									lineHeight: "150%",
									width: "90%",
									m: "4% auto 4%",
								}}
							>
								If the amount of {tokenName} used sits outside{" "}
								<span style={{ fontWeight: "bold" }}>{slippage}%</span> <br />
								{!!coreAmount && (
									<span>
										(<b>{slippageValues?.min.toFixed(2)}</b>-
										<b>{slippageValues?.max.toFixed(2)}</b> {tokenName}),
									</span>
								)}{" "}
								<span style={{ fontWeight: "bold" }}>
									the transaction will fail.
								</span>
							</Typography>
						</Box>
					</Box>
				)}
			</Box>
		</>
	);
};

export default Settings;
