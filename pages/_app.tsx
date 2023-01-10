import type { AppProps } from "next/app";
import CssBaseline from "@mui/material/CssBaseline";
import { CENNZ_NETWORK, VERCEL_URL } from "@/libs/constants";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trackPageView } from "@/libs/utils";
import { DefaultSeo } from "next-seo";
import UserAgentProvider from "@/libs/providers/UserAgentProvider";
import MetaMaskExtensionProvider from "@/libs/providers/MetaMaskExtensionProvider";
import WalletProvider from "@/libs/providers/WalletProvider";
import MetaMaskWalletProvider from "@/libs/providers/MetaMaskWalletProvider";
import CENNZWalletProvider from "@/libs/providers/CENNZWalletProvider";
import GlobalModalProvider from "@/libs/providers/GlobalModalProvider";
import CENNZExtensionProvider from "@/libs/providers/CENNZExtensionProvider";
import CENNZApiProvider from "@/libs/providers/CENNZApiProvider";
import ThemeProvider from "@/libs/providers/ThemeProvider";
import {
	CssGlobal,
	PageBackdrop,
	WalletButton,
	AppSwitch,
	PageFooter,
	PageFrame,
} from "@/libs/components";

type MyAppProps = Omit<AppProps, "pageProps"> & {
	pageProps: {};
};

function MyApp({ Component, pageProps }: MyAppProps) {
	const { events } = useRouter();

	useEffect(() => {
		if (!events) return;

		events.on("routeChangeComplete", trackPageView);
		return () => {
			events.off("routeChangeComplete", trackPageView);
		};
	}, [events]);

	return (
		<>
			<DefaultSeo
				titleTemplate="CENNZnet App Hub | %s"
				title="CENNZnet App Hub"
				description="App Hub powered by CENNZnet."
				openGraph={{
					images: [
						{
							url: `https://${VERCEL_URL || "app.cennz.net"}/share.png`,
							width: 800,
							height: 500,
						},
					],
				}}
			/>
			<CssBaseline />
			<ThemeProvider>
				<CssGlobal />
				<UserAgentProvider>
					<MetaMaskExtensionProvider>
						<WalletProvider>
							<CENNZExtensionProvider>
								<CENNZApiProvider endpoint={CENNZ_NETWORK.ApiUrl.InWebSocket}>
									<MetaMaskWalletProvider>
										<CENNZWalletProvider>
											<GlobalModalProvider>
												<PageBackdrop />
												<WalletButton />
												<AppSwitch />
												<Component {...pageProps} />
												<PageFooter />
												<PageFrame />
											</GlobalModalProvider>
										</CENNZWalletProvider>
									</MetaMaskWalletProvider>
								</CENNZApiProvider>
							</CENNZExtensionProvider>
						</WalletProvider>
					</MetaMaskExtensionProvider>
				</UserAgentProvider>
			</ThemeProvider>
		</>
	);
}

export default MyApp;
