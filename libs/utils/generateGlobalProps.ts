import { Api } from "@cennznet/api";
import { SectionUri } from "@/libs/types";

export interface GlobalProps {}

export default async function generateGlobalProps(
	section: SectionUri
): Promise<GlobalProps> {
	const api = await Api.create({ provider: process.env.NEXT_PUBLIC_API_URL });

	return {};
}
