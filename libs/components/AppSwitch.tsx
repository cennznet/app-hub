import { FC, useEffect } from "react";
import { css } from "@emotion/react";
import Link from "next/link";
import { Theme } from "@mui/material";
import { useSectionUri } from "@hooks";
import { useMetaMaskExtension } from "@providers/MetaMaskExtensionProvider";
import { ensureEthereumChain } from "@utils";

const Switch: FC = () => {
	const section = useSectionUri();
	const { extension } = useMetaMaskExtension();

	useEffect(() => {
		if (!extension) return;

		if (section === "bridge") void ensureEthereumChain(extension);
	}, [extension, section]);

	return (
		<nav css={styles.container}>
			<Link href="/swap" passHref={true}>
				<a css={styles.navItem(section === "swap")}>
					<span>Swap</span>
				</a>
			</Link>
			<Link href="/pool" passHref={true}>
				<a css={styles.navItem(section === "pool")}>
					<span>Pool</span>
				</a>
			</Link>
			<Link href="/bridge" passHref={true}>
				<a css={styles.navItem(section === "bridge")}>
					<span>Bridge</span>
				</a>
			</Link>
			<Link href="/transfer" passHref={true}>
				<a css={styles.navItem(section === "transfer")}>
					<span>Transfer</span>
				</a>
			</Link>
		</nav>
	);
};

export default Switch;

export const styles = {
	container: ({ shadows }: Theme) => css`
		width: 30em;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		margin: 3em auto;
		box-shadow: ${shadows[1]};
		border-radius: 4px;
		overflow: hidden;
		position: relative;
	`,

	navItem:
		(active: boolean) =>
		({ palette, transitions }: Theme) =>
			css`
				text-decoration: none;
				background-color: white;
				height: 48px;
				max-width: 120px;
				flex: 1;
				font-weight: 500;
				font-size: 14px;
				text-align: center;
				line-height: 48px;
				text-transform: uppercase;
				color: ${palette.primary.main};
				border-bottom: ${active
					? `2px solid ${palette.primary.main}`
					: `2px solid white`};

				&:hover {
					background-color: white;

					> span {
						opacity: 1;
					}
				}

				> span {
					opacity: ${active ? 1 : 0.5};
					transition: opacity ${transitions.duration.short}ms;
				}
			`,
};
