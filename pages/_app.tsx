import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/styles/theme";
import CssBaseline from "@mui/material/CssBaseline";
import "@/styles/global.css";
import CENNZApiProvider from "@/providers/CENNZApiProvider";
import SupportedWalletProvider from "@/providers/SupportedWalletProvider";
import Switch from "@/components/AppSwitch";
import Wallet from "@/components/Wallet";
import SupportedAssetsProvider from "@/providers/SupportedAssetsProvider";
import BridgeProvider from "@/providers/BridgeProvider";
import { GlobalProps } from "@/utils/generateGlobalProps";
import UserAgentProvider from "@/providers/UserAgentProvider";
import CENNZExtensionProvider from "@/providers/CENNZExtensionProvider";
import PageBackdrop from "@/components/shared/PageBackdrop";
import PageFrame from "@/components/shared/PageFrame";

type MyAppProps = Omit<AppProps, "pageProps"> & {
	pageProps: {} & GlobalProps;
};

function MyApp({
	Component,
	pageProps: { supportedAssets, ...pageProps },
}: MyAppProps) {
	return (
		<>
			<Head>
				<title>CENNZnet App Hub</title>
				<meta name="description" content="App Hub powered by CENNZnet" />
				<link rel="icon" href="/favicon.svg" />
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<UserAgentProvider>
					<CENNZExtensionProvider>
						<CENNZApiProvider endpoint={process.env.NEXT_PUBLIC_API_URL}>
							<SupportedAssetsProvider supportedAssets={supportedAssets}>
								<SupportedWalletProvider>
									<BridgeProvider
										ethChainId={process.env.NEXT_PUBLIC_ETH_CHAIN_ID}
									>
										<PageBackdrop />
										<Wallet />
										<Switch />
										<Component {...pageProps} />
										<PageFrame />
									</BridgeProvider>
								</SupportedWalletProvider>
							</SupportedAssetsProvider>
						</CENNZApiProvider>
					</CENNZExtensionProvider>
				</UserAgentProvider>
			</ThemeProvider>
		</>
	);
}

export default MyApp;
