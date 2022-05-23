import type { AppProps } from "next/app";
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
import PageFooter from "@/components/shared/PageFooter";
import GlobalModalProvider from "@/providers/GlobalModalProvider";
import CssGlobal from "@/components/CssGlobal";
import MetaMaskExtensionProvider from "@/providers/MetaMaskExtensionProvider";
import { API_URL, VERCEL_URL } from "@/constants";
import MetaMaskWalletProvider from "@/providers/MetaMaskWalletProvider";
import { useRouter } from "next/router";
import { memo, useEffect } from "react";
import { trackPageView } from "@/utils";
import { DefaultSeo } from "next-seo";
import WalletProvider from "@/providers/WalletProvider";

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
