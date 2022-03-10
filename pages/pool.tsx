import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchPoolAssets from "@/utils/fetchPoolAssets";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { API_URL } from "@/constants";
import generateGlobalProps from "@/utils/generateGlobalProps";
import MainPanel from "@/components/MainPanel";

export async function getStaticProps() {
	const api = await Api.create({ provider: API_URL });

	return {
		props: {
			supportedAssets: await fetchPoolAssets(api),
			...(await generateGlobalProps("pool")),
		},
	};
}

const Pool: React.FC<{ supportedAssets: CENNZAsset[] }> = ({
	supportedAssets,
}) => {
	return <MainPanel defaultTitle="Add to Pool"></MainPanel>;
};

export default Pool;
