import type { AppProps } from "next/app";
import Head from "next/head";
import ThemeProvider from "@/providers/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import CENNZApiProvider from "@/providers/CENNZApiProvider";
import CENNZWalletProvider from "@/providers/CENNZWalletProvider";
import Switch from "@/components/AppSwitch";
import Wallet from "@/components/Wallet";
import SupportedAssetsProvider from "@/providers/SupportedAssetsProvider";
import BridgeProvider from "@/providers/BridgeProvider";
import { GlobalProps } from "@/utils/generateGlobalProps";
import UserAgentProvider from "@/providers/UserAgentProvider";
import CENNZExtensionProvider from "@/providers/CENNZExtensionProvider";
import PageBackdrop from "@/components/shared/PageBackdrop";
import PageFrame from "@/components/shared/PageFrame";
import GlobalModalProvider from "@/providers/GlobalModalProvider";
import CssGlobal from "@/components/CssGlobal";

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
			<ThemeProvider>
				<CssBaseline />
				<CssGlobal />
				<UserAgentProvider>
					<CENNZExtensionProvider>
						<CENNZApiProvider endpoint={process.env.NEXT_PUBLIC_API_URL}>
							<SupportedAssetsProvider supportedAssets={supportedAssets}>
								<CENNZWalletProvider>
									<BridgeProvider
										ethChainId={process.env.NEXT_PUBLIC_ETH_CHAIN_ID}
									>
										<GlobalModalProvider>
											<PageBackdrop />
											<Wallet />
											<Switch />
											<Component {...pageProps} />
											<PageFrame />
										</GlobalModalProvider>
									</BridgeProvider>
								</CENNZWalletProvider>
							</SupportedAssetsProvider>
						</CENNZApiProvider>
					</CENNZExtensionProvider>
				</UserAgentProvider>
			</ThemeProvider>
		</>
	);
}

export default MyApp;
