import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchSwapAssets from "@/utils/fetchSwapAssets";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { API_URL } from "@/constants";
import generateGlobalProps from "@/utils/generateGlobalProps";
import SwapProvider from "@/providers/SwapProvider";
import SwapForm from "@/components/SwapForm";
import SwapAssetsPair from "@/components/SwapAssetsPair";
import SwapStats from "@/components/SwapStats";
import SwapSettings from "@/components/SwapSettings";
import SwapProgress from "@/components/SwapProgress";

export async function getStaticProps() {
	const api = await Api.create({ provider: API_URL });

	return {
		props: {
			supportedAssets: await fetchSwapAssets(api),
			...(await generateGlobalProps("swap")),
		},
	};
}

const Swap: React.FC<{ supportedAssets: CENNZAsset[] }> = ({
	supportedAssets,
}) => {
	return (
		<SwapProvider supportedAssets={supportedAssets}>
			<div css={styles.root}>
				<h1 css={styles.heading}>SWAP</h1>

				<SwapForm>
					<SwapAssetsPair />
					<SwapStats />
					<SwapSettings />
				</SwapForm>
				<SwapProgress />
			</div>
		</SwapProvider>
	);
};

export default Swap;

const styles = {
	root: ({ shadows }: Theme) => css`
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 550px;
		border-radius: 4px;
		margin: 0 auto 5em;
		position: relative;
		background-color: #ffffff;
		box-shadow: ${shadows[1]};
		padding: 1.5em 2.5em 2.5em;
		overflow: hidden;
	`,

	heading: ({ palette }: Theme) => css`
		font-weight: bold;
		font-size: 20px;
		line-height: 1;
		text-align: center;
		text-transform: uppercase;
		color: ${palette.primary.main};
		margin-bottom: 1.5em;
	`,
};
