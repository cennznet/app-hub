import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { ClickAwayListener } from "@mui/material";
import { PoolAction } from "@/providers/PoolProvider";

const options = ["Your Account", "Liquidity Pool"];

const PoolSwapper: React.FC<{
	topText: string;
	poolAction: string;
	onChange: Function;
}> = ({ topText, poolAction, onChange }) => {
	const [itemDropDownActive, setItemDropDownActive] = useState<boolean>(false);
	const [selectedItemIdx, setSelectedItemIdx] = useState<number>(0);

	useEffect(() => {
		let index: number;
		if (topText === "From") {
			index = poolAction === PoolAction.ADD ? 0 : 1;
		} else {
			index = poolAction === PoolAction.ADD ? 1 : 0;
		}
		setSelectedItemIdx(index);
	}, [topText, poolAction, setSelectedItemIdx]);

	return (
		<div css={styles.chainPickerContainer}>
			<p css={styles.upperText}>{topText}</p>
			<div css={styles.chainPickerBox}>
				<div css={styles.chainSelector}>
					<button
						type="button"
						css={styles.chainButton}
						onClick={() => setItemDropDownActive(!itemDropDownActive)}
					>
						{options[selectedItemIdx]}
						{options.length > 1 && (
							<svg
								css={
									itemDropDownActive
										? styles.chainSelectedArrow
										: styles.chainSelectedArrowDown
								}
								width="14"
								height="14"
								viewBox="0 0 14 14"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M7.53125 1.0625C7.25 0.781249 6.78125 0.781249 6.5 1.0625L0.406251 7.125C0.125001 7.4375 0.125001 7.90625 0.406251 8.1875L1.125 8.90625C1.40625 9.1875 1.875 9.1875 2.1875 8.90625L7 4.09375L11.8438 8.90625C12.1563 9.1875 12.625 9.1875 12.9063 8.90625L13.625 8.1875C13.9063 7.90625 13.9063 7.4375 13.625 7.125L7.53125 1.0625Z"
									fill={"#020202"}
								/>
							</svg>
						)}
					</button>
					{itemDropDownActive && options.length > 1 && (
						<ClickAwayListener onClickAway={() => setItemDropDownActive(false)}>
							<div css={styles.chainDropdownContainer}>
								{options.map((option: string, i) => {
									if (option !== options[selectedItemIdx]) {
										return (
											<div
												key={i}
												onClick={() => {
													setSelectedItemIdx(i);
													setItemDropDownActive(false);
													onChange();
												}}
												css={styles.chainChoiceContainer}
											>
												<span>{option}</span>
											</div>
										);
									}
								})}
							</div>
						</ClickAwayListener>
					)}
				</div>
			</div>
			<br />
		</div>
	);
};

export default PoolSwapper;

export const styles = {
	chainPickerContainer: css`
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		margin-bottom: 17px;
		height: 94px;
	`,
	chainPickerBox: css`
		display: flex;
		flex-direction: row;
		width: 197px;
		height: 60px;
		justify-content: space-between;
		align-items: center;
		border: 1px solid #020202;
	`,
	chainSelector: css`
		height: 60px;
		border-left: none;
		border-right: none;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;

		&:focus-visible {
			outline: none;
		}
	`,
	chainSelectedImg: css`
		margin-left: 13px;
	`,
	chainSelectedArrow: css`
		margin-left: 27px;
	`,
	chainSelectedArrowDown: css`
		margin-left: 27px;
		transform: rotate(-180deg);
	`,
	chainButton: css`
		cursor: pointer;
		height: 60px;
		width: 175px;
		border: none;
		position: relative;
		background-color: transparent;
		font-style: normal;
		font-weight: bold;
		font-size: 14px;
		line-height: 125%;
		letter-spacing: 1.12428px;
		text-transform: uppercase;
		margin-left: 6px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #020202;
	`,
	chainDropdownContainer: css`
		position: absolute;
		top: 60px;
		right: -15px;
		background: #ffffff;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
		z-index: 5;
		width: 197px;
		min-height: 47px;
		max-height: 47px;
		height: 100%;
		overflow: auto;

		span {
			padding: 12px 8px;
			margin-top: 5px;
			text-decoration: none;
			font-style: normal;
			font-weight: bold;
			font-size: 14px;
			line-height: 125%;
			display: flex;
			align-items: center;
			letter-spacing: 1.12428px;
			text-transform: uppercase;
			color: #020202;
			justify-content: center;
			align-items: center;
		}
	`,
	chainChoiceContainer: css`
		cursor: pointer;
		display: flex;
		flex-direction: row;

		img {
			margin-left: 11px;
			margin-top: 7px;
			margin-bottom: 7px;
		}

		&:hover {
			background: #f5ecff;
		}
	`,
	upperText: css`
		font-style: normal;
		font-weight: bold;
		font-size: 14px;
		line-height: 125%;
		letter-spacing: 1.12428px;
		text-transform: uppercase;
		color: #020202;
		margin-bottom: 6px;
		margin-top: 0px;
	`,
};
