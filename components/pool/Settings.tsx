import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { ClickAwayListener } from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
			<div css={styles.settingsBox(open)}>
				<div
					css={styles.settings(open)}
					onClick={() => {
						setOpen(!open);
						setInfoOpen(false);
					}}
				>
					<div css={styles.settingsHeader}>SETTINGS</div>
					<img
						alt="arrow"
						src={"/images/arrow_up.svg"}
						css={styles.settingsArrow(open)}
					/>
				</div>

				{open && (
					<div css={styles.openSettingsBox}>
						<div css={styles.settingsHeader}>SLIPPAGE</div>
						<div css={styles.openSettings}>
							<input
								type="number"
								placeholder={String(slippage)}
								css={styles.slippageInput}
								min={"1"}
								max={"10"}
								onChange={(e) => setSlippage(Number(e.target.value))}
							/>
							<div css={styles.percentIconBox}>
								<PercentIcon css={styles.percentIcon} />
							</div>
							<ClickAwayListener onClickAway={() => setInfoOpen(false)}>
								<div
									css={styles.infoIconBox}
									onClick={() => setInfoOpen(!infoOpen)}
								>
									<InfoOutlinedIcon css={styles.infoIcon(infoOpen)} />
								</div>
							</ClickAwayListener>
							{infoOpen && (
								<div css={styles.infoOpenBox}>
									<div css={styles.infoOpenText}>
										<b>Slippage</b>
										&nbsp;is the difference between the price you expect to get
										on the crypto you have ordered and the price you actually
										get when the transaction is sent.
									</div>
								</div>
							)}
						</div>
						<div css={styles.slippageTextBox(color)}>
							<div css={styles.slippageText}>
								If the amount of {tokenName} used sits outside{" "}
								<b>{slippage}%</b> <br />
								{!!coreAmount && (
									<span>
										(<b>{slippageValues.min?.toFixed(2)}</b>-
										<b>{slippageValues.max?.toFixed(2)}</b> {tokenName}),
									</span>
								)}{" "}
								<b>the transaction will fail.</b>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Settings;

export const styles = {
	settingsBox: (open: boolean) => css`
		margin-top: 30px;
		width: 468px;
		margin-bottom: ${open && "36px"};
	`,
	settings: (open: boolean) => css`
		display: flex;
		flex-direction: row;
		cursor: pointer;
		margin-bottom: ${open ? "35px" : "36px"};
	`,
	settingsHeader: css`
		font-size: 14px;
		line-height: 17.5px;
		font-weight: 500;
		letter-spacing: 1.2px;
	`,
	settingsArrow: (open: boolean) => css`
		margin-left: 10px;
		transform: ${!open && "rotate(180deg)"};
	`,
	openSettingsBox: css`
		margin: 0 auto;
	`,
	openSettings: css`
		margin: 10px auto;
		width: auto;
		margin-left: 0;
		height: auto;
		display: flex;
		flex-direction: row;
	`,
	slippageInput: css`
		width: 150px;
		height: 60px;
		font-size: 16px;
		font-weight: bold;
		line-height: 16px;
		color: #020202;
		border: 1px solid #979797;
		border-right: none;
		outline: none;
		padding: 15px;
	`,
	percentIconBox: css`
		width: 40px;
		height: 60px;
		border: 1px solid #979797;
		display: flex;
		align-items: center;
	`,
	percentIcon: css`
		margin: 0 auto;
		font-size: large;
	`,
	infoIconBox: css`
		width: 40px;
		height: 60px;
		display: flex;
		align-items: center;
		padding-left: 15px;
		cursor: pointer;
	`,
	infoIcon: (infoOpen: boolean) => css`
		font-size: 25px;
		color: ${infoOpen ? "#1130FF" : "black"};
	`,
	infoOpenBox: css`
		position: absolute;
		left: 52%;
		top: 66%;
		border: 1px solid #979797;
		box-sizing: border-box;
		width: 228px;
		height: auto;
		background-color: white;
		z-index: +1;
		box-shadow: 4px 8px 8px rgba(17, 48, 255, 0.1);
	`,
	infoOpenText: css`
		margin: 10px 10px 10px 10px;
		font-size: 13px;
		line-height: 150%;
	`,
	slippageTextBox: (color: string) => css`
		width: 468px;
		height: auto;
		margin: 30px 0 36px;
		background-color: ${color ? color : "#F5ECFF"};
		display: flex;
	`,
	slippageText: css`
		font-size: 16px;
		line-height: 150%;
		width: 90%;
		margin: 4% auto 4%;
	`,
};
