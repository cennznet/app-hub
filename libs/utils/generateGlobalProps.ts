import { Api } from "@cennznet/api";
import { SectionUri } from "@/libs/types";
import { CENNZ_NETWORK } from "@/libs/constants";

export interface GlobalProps {}

export default async function generateGlobalProps(
	section: SectionUri
): Promise<GlobalProps> {
	return {};
}
