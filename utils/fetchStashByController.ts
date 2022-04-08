import { Api } from "@cennznet/api";
import { Option } from "@cennznet/types";

export async function fetchStashByController(
	address: string,
	api: Api
): Promise<string | null> {
	const ledgerOption: Option<any> = (await api.query.staking.ledger(
		address
	)) as Option<any>;

	if (ledgerOption.isNone) {
		return null;
	}

	return ledgerOption.unwrapOrDefault().stash.toString();
}
