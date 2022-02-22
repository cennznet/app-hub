import React, { useState } from "react";
import styles from "@/styles/components/pool/PoolSwaper.module.css";

const PoolSwaper: React.FC<{
	options: string[];
	topText: string;
	bottomText?: string;
	color?: string;
}> = ({ options, bottomText, topText, color }) => {
	const [itemDropDownActive, setItemDropDownActive] = useState<boolean>(false);
	const [selectedItemIdx, setSelectedItemIdx] = useState<number>(0);

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
								<img
									className={
										itemDropDownActive
											? styles.chainSelectedArrow
											: styles.chainSelectedArrowDown
									}
									alt="arrow"
									src={"/arrow_up.svg"}
								/>
							)}
						</button>
					</>
					{itemDropDownActive && (
						<div className={styles.chainDropdownContainer}>
							{options.map((option: string, i) => {
								if (option !== options[selectedItemIdx]) {
									return (
										<div
											key={i}
											onClick={() => {
												setSelectedItemIdx(i);
												setItemDropDownActive(false);
											}}
											className={styles.chainChoiceContainer}
										>
											<span>{option}</span>
										</div>
									);
								}
							})}
						</div>
					)}
				</div>
			</div>
			<div className={styles.bottomText}>{bottomText}</div>
		</div>
	);
};

export default PoolSwaper;
