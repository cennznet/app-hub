import React, { useState, useEffect } from "react";
import { Chain } from "../../types";

import styles from "../../styles/components/bridge/chainpicker.module.css";
import { ETH_LOGO } from "../../utils/bridge/helpers";

const CHAINS: Chain[] = [
	{
		name: "Cennznet",
		logo: "images/cennz.svg",
	},
	{
		name: "Ethereum",
		logo: ETH_LOGO,
	},
];

const ChainPicker: React.FC<{
	setChain: Function;
}> = ({ setChain }) => {
	const [chains, setChains] = useState<Chain[]>(CHAINS);
	const [chainDropDownActive, setChainDropDownActive] =
		useState<boolean>(false);
	const [selectedChainIdx, setSelectedChainIdx] = useState<number>(0);

	useEffect(() => {
		setChain(chains[selectedChainIdx]);
	}, [selectedChainIdx]);

	return (
		<div className={styles.chainPickerContainer}>
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
							})}
						</div>
					)}
				</div>
			</div>
			<div className={styles.bottomTextContainer}>CHAIN</div>
		</div>
	);
};

export default ChainPicker;
