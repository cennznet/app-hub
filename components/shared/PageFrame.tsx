import { FC, useMemo } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/components/shared/PageFrame.module.scss";

const PageFrame: FC<{}> = () => {
	const { pathname } = useRouter();
	const section = useMemo(() => {
		const section = pathname.replace("/", "").trim();
		if (section === "") return "swap";
		return section as "swap" | "pool" | "bridge";
	}, [pathname]);
	return (
		<div className={`${styles.container} ${styles[`container--${section}`]}`} />
	);
};

export default PageFrame;
