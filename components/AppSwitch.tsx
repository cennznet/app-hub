import { css } from "@emotion/react";
import Link from "next/link";
import { Theme } from "@mui/material";
import useSectionUri from "@/hooks/useSectionUri";

const Switch: React.FC<{}> = () => {
	const section = useSectionUri();
	return (
		<nav css={styles.container}>
			<Link href="/swap" passHref={true}>
				<a css={styles.navItem(section === "swap")}>Swap</a>
			</Link>
			<Link href="/pool" passHref={true}>
				<a css={styles.navItem(section === "pool")}>Pool</a>
			</Link>
			<Link href="/bridge" passHref={true}>
				<a css={styles.navItem(section === "bridge")}>Bridge</a>
			</Link>
		</nav>
	);
};

export default Switch;

export const styles = {
	container: css`
		width: 360px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		margin: 3em auto;
		box-shadow: 4px 8px 8px rgba(17, 48, 255, 0.1);
		border-radius: 4px;
		overflow: hidden;
		position: relative;
	`,

	navItem:
		(active: boolean) =>
		({ palette }: Theme) =>
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
				color: ${active ? palette.primary.main : "rgba(17,48,255,0.5)"};
				border-bottom: ${active
					? `2px solid ${palette.primary.main}`
					: `2px solid white`};
				transition: color 0.2s;

				&:hover {
					color: ${palette.primary.main};
					background-color: white;
				}
			`,
};
