import { FC, useMemo } from "react";
import styles from "@/styles/components/shared/PageBackdrop.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

const PageBackdrop: FC<{}> = () => {
	const { pathname } = useRouter();
	const section = useMemo(() => {
		const section = pathname.replace("/", "").trim();
		if (section === "") return "swap";
		return section;
	}, [pathname]);

	return (
		<div className={`${styles.container} ${styles[`container--${section}`]}`}>
			<Link href="/">
				<a className={`${styles.logo} ${styles[`logo--${section}`]}`}>
					<img src="/images/cennz-white.svg" alt="CENNZnet" />
				</a>
			</Link>
		</div>
	);
};

export default PageBackdrop;
