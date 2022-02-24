import React, { useEffect, useState } from "react";
import styles from "@/styles/components/pool/PoolSwapper.module.css";
import { ClickAwayListener } from "@mui/material";

const PoolSwapper: React.FC<{
	options: string[];
	topText: string;
	onChange?: Function;
	bottomText?: string;
	forceIndex?: number;
	initialIndex: number;
}> = ({ options, topText, forceIndex, initialIndex, onChange }) => {
	const [itemDropDownActive, setItemDropDownActive] = useState<boolean>(false);
	const [selectedItemIdx, setSelectedItemIdx] = useState<number>(0);

	useEffect(() => {
		setSelectedItemIdx(initialIndex);
		if (!forceIndex) return;
		setSelectedItemIdx(forceIndex);
	}, [forceIndex, initialIndex]);

	return (
		<div className={styles.chainPickerContainer}>
			<p className={styles.upperText}>{topText}</p>
			<div className={styles.chainPickerBox}>
				<div className={styles.chainSelector}>
					<>
						<button
							type="button"
							className={styles.chainButton}
							onClick={() => setItemDropDownActive(!itemDropDownActive)}
						>
							{options[selectedItemIdx]}
							{options.length > 1 && (
								<svg
									className={
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
					</>
					{itemDropDownActive && options.length > 1 && (
						<ClickAwayListener onClickAway={() => setItemDropDownActive(false)}>
							<div className={styles.chainDropdownContainer}>
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
												className={styles.chainChoiceContainer}
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
