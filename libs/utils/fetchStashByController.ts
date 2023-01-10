import { Api } from "@cennznet/api";
import { IOption } from "@cennznet/types";

export async function fetchStashByController(
	address: string,
	api: Api
): Promise<string | null> {
	const ledgerOption = (await api.query.staking.ledger(
		address
	)) as IOption<any>;

	if (ledgerOption.isNone) {
		return null;
	}

	return ledgerOption.unwrapOrDefault().stash.toString();
}
