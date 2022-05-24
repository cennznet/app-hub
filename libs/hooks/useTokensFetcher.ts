import { useCENNZApi } from "@providers/CENNZApiProvider";
import { Api } from "@cennznet/api";
import { useEffect, useMemo, useState } from "react";

export default function useTokensFetcher<T>(
	fetcher: (api: Api) => Promise<T>,
	defaultTokens: T = null
): [T, () => void] {
	const { api } = useCENNZApi();
	const [tokens, setTokens] = useState<T>(defaultTokens);
	const updateTokens = useMemo(() => {
		if (!api) return;
		return async () => {
			const tokens = await fetcher(api);
			setTokens(tokens);
		};
	}, [api, fetcher]);

	useEffect(() => {
		updateTokens?.();
	}, [updateTokens]);

	return [tokens, updateTokens];
}
