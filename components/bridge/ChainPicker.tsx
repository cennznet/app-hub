import React, { useState, useEffect } from "react";
import { Chain, SupportedChain } from "../../types";

import styles from "../../styles/components/bridge/chainpicker.module.css";
import { CHAINS } from "../../utils/bridge/helpers";

const ChainPicker: React.FC<{
	setChain: Function;
	setOppositeChain: Function;
	initialChain: SupportedChain;
	forceChain: SupportedChain;
	topText?: string;
}> = ({ setChain, initialChain, setOppositeChain, forceChain, topText }) => {
	const [chains, _] = useState<Chain[]>(CHAINS);
	const [chainDropDownActive, setChainDropDownActive] =
		useState<boolean>(false);
	const [selectedChainIdx, setSelectedChainIdx] = useState<number>(0);
	const [initialRenderComplete, setInitialRenderComplete] =
		useState<boolean>(false);

	useEffect(() => {
		const foundChainIdx = chains.findIndex(
			(chain) => chain.name === initialChain
		);
		if (foundChainIdx === selectedChainIdx) return;
		setSelectedChainIdx(foundChainIdx);
		setChain(initialChain);
	}, []);

	useEffect(() => {
		if (initialChain === forceChain && !initialRenderComplete) {
			setInitialRenderComplete(true);
			return;
		}
		const foundChainIdx = chains.findIndex(
			(chain) => chain.name === forceChain
		);
		if (foundChainIdx === selectedChainIdx) return;
		setSelectedChainIdx(foundChainIdx);
	}, [forceChain]);

	useEffect(() => {
		setChain(chains[selectedChainIdx]);
		const foundOppositeChainIdx = chains.findIndex(
			(chain) => chain.name !== chains[selectedChainIdx].name
		);
		setOppositeChain(chains[foundOppositeChainIdx]);
	}, [selectedChainIdx]);

	return (
		<div className={styles.chainPickerContainer}>
			<p className={styles.upperText}>{topText}</p>
			<div className={styles.chainPickerBox}>
				<div className={styles.chainSelector}>
					<>
						<img
							className={styles.chainSelectedImg}
							alt=""
							src={chains[selectedChainIdx]?.logo}
							width={33}
							height={33}
						/>
						<button
							type="button"
							className={styles.chainButton}
							onClick={() => setChainDropDownActive(!chainDropDownActive)}
						>
							{chains[selectedChainIdx]?.name}
							<img
								className={
									chainDropDownActive
										? styles.chainSelectedArrow
										: styles.chainSelectedArrowDown
								}
								alt="arrow"
								src={"/arrow_up.svg"}
							/>
						</button>
					</>
					{chainDropDownActive && (
						<div className={styles.chainDropdownContainer}>
							{chains.map((chain: any, i) => {
								if (chain.name !== chains[selectedChainIdx].name) {
									return (
										<div
											key={i}
											onClick={() => {
												setSelectedChainIdx(i);
												setChainDropDownActive(false);
											}}
											className={styles.chainChoiceContainer}
										>
											<img alt="" src={chain.logo} width={33} height={33} />
											<span>{chain.name}</span>
										</div>
									);
								}
							})}
						</div>
					)}
				</div>
			</div>
			<div className={styles.bottomText}>CHAIN</div>
		</div>
	);
};

export default ChainPicker;
