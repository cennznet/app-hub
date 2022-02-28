import { FC, useMemo } from "react";
import { css } from "@emotion/react";
import { useRouter } from "next/router";

const PageFrame: FC<{}> = () => {
	const { pathname } = useRouter();
	const section = useMemo(() => {
		const section = pathname.replace("/", "").trim();
		if (section === "") return "swap";
		return section as "swap" | "pool" | "bridge";
	}, [pathname]);
	return <div css={styles.container(section)} />;
};

export default PageFrame;

export const styles = {
	container:
		(section: string) =>
		({ palette }) =>
			css`
				position: fixed;
				inset: 0;
				z-index: 1000;
				pointer-events: none;
				border: 8px solid ${palette.primary[section]};
			`,
};
