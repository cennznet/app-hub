import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/styles/theme";
import CssBaseline from "@mui/material/CssBaseline";
import "@/styles/global.css";
import CENNZApiProvider from "@/providers/CENNZApiProvider";
import SupportedWalletProvider from "@/providers/SupportedWalletProvider";
import Switch from "@/components/AppSwitch";
import Wallet from "@/components/Wallet";
import SupportedAssetsProvider from "@/providers/SupportedAssetsProvider";
import BlockchainProvider from "@/providers/BlockchainProvider";
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
	const router = useRouter();
	const [location, setLocation] = useState<string>();

	useEffect(() => {
		if (location !== undefined) router.push(`/${location}`);
		//eslint-disable-next-line
	}, [location]);

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
						<CENNZApiProvider>
							<SupportedAssetsProvider supportedAssets={supportedAssets}>
								<SupportedWalletProvider>
									<BlockchainProvider>
										<PageBackdrop />
										<Wallet />
										<Switch setLocation={setLocation} />
										<Component {...pageProps} />
										<PageFrame />
									</BlockchainProvider>
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
