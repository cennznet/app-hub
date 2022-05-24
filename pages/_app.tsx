import type { AppProps } from "next/app";
import CssBaseline from "@mui/material/CssBaseline";
import { API_URL, VERCEL_URL } from "@/libs/constants";
import { useRouter } from "next/router";
import { memo, useEffect } from "react";
import { trackPageView } from "@utils";
import { DefaultSeo } from "next-seo";
import UserAgentProvider from "@providers/UserAgentProvider";
import MetaMaskExtensionProvider from "@providers/MetaMaskExtensionProvider";
import WalletProvider from "@providers/WalletProvider";
import MetaMaskWalletProvider from "@providers/MetaMaskWalletProvider";
import CENNZWalletProvider from "@providers/CENNZWalletProvider";
import GlobalModalProvider from "@providers/GlobalModalProvider";
import CENNZExtensionProvider from "@providers/CENNZExtensionProvider";
import CENNZApiProvider from "@providers/CENNZApiProvider";
import ThemeProvider from "@providers/ThemeProvider";
import {
	CssGlobal,
	PageBackdrop,
	WalletButton,
	AppSwitch,
	PageFooter,
	PageFrame,
} from "@components";
import { GlobalProps } from "@utils/generateGlobalProps";

type MyAppProps = Omit<AppProps, "pageProps"> & {
	pageProps: {} & GlobalProps;
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
								<CENNZApiProvider endpoint={API_URL}>
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

export default memo(MyApp);
