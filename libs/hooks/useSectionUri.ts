import { useMemo } from "react";
import { useRouter } from "next/router";
import { SectionUri } from "@/libs/types";

export default function useSectionUri(): SectionUri {
	const { pathname } = useRouter();
	return useMemo<SectionUri>(() => {
		const section = pathname.replace("/", "").trim();
		return section as SectionUri;
	}, [pathname]);
}
