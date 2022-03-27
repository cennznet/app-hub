import type { AppProps } from "next/app";
import Head from "next/head";
import ThemeProvider from "@/providers/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import CENNZApiProvider from "@/providers/CENNZApiProvider";
import CENNZWalletProvider from "@/providers/CENNZWalletProvider";
import AppSwitch from "@/components/AppSwitch";
import WalletButton from "@/components/WalletButton";
import { GlobalProps } from "@/utils/generateGlobalProps";
import UserAgentProvider from "@/providers/UserAgentProvider";
import CENNZExtensionProvider from "@/providers/CENNZExtensionProvider";
import PageBackdrop from "@/components/shared/PageBackdrop";
import PageFrame from "@/components/shared/PageFrame";
import GlobalModalProvider from "@/providers/GlobalModalProvider";
import CssGlobal from "@/components/CssGlobal";
import MetaMaskExtensionProvider from "@/providers/MetaMaskExtensionProvider";
import { API_URL } from "@/constants";
import MetaMaskWalletProvider from "@/providers/MetaMaskWalletProvider";

type MyAppProps = Omit<AppProps, "pageProps"> & {
	pageProps: {} & GlobalProps;
};

function MyApp({ Component, pageProps }: MyAppProps) {
	return (
		<>
			<Head>
				<title>CENNZnet App Hub</title>
				<meta name="description" content="App Hub powered by CENNZnet" />
				<link rel="icon" href="/favicon.svg" />
			</Head>
			<CssBaseline />
			<ThemeProvider>
				<CssGlobal />
				<UserAgentProvider>
					<CENNZExtensionProvider>
						<MetaMaskExtensionProvider>
							<CENNZApiProvider endpoint={API_URL}>
								<CENNZWalletProvider>
									<MetaMaskWalletProvider>
										<GlobalModalProvider>
											<PageBackdrop />
											<WalletButton />
											<AppSwitch />
											<Component {...pageProps} />
											<PageFrame />
										</GlobalModalProvider>
									</MetaMaskWalletProvider>
								</CENNZWalletProvider>
							</CENNZApiProvider>
						</MetaMaskExtensionProvider>
					</CENNZExtensionProvider>
				</UserAgentProvider>
			</ThemeProvider>
		</>
	);
}

export default MyApp;
