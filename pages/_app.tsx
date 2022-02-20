import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { isBrowser, isTablet } from "react-device-detect";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/styles/theme";
import CssBaseline from "@mui/material/CssBaseline";
import "@/styles/global.css";
import { Box } from "@mui/material";
import CENNZApiProvider from "@/providers/CENNZApiProvider";
import SupportedWalletProvider from "@/providers/SupportedWalletProvider";
import Switch from "@/components/AppSwitch";
import Wallet from "@/components/Wallet";
import SupportedAssetsProvider from "@/providers/SupportedAssetsProvider";
import BlockchainProvider from "@/providers/BlockchainProvider";
import UserAgentProvider from "@/providers/UserAgentProvider";
import CENNZExtensionProvider from "@/providers/CENNZExtensionProvider";

function MyApp({ Component, pageProps }: AppProps) {
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
							<SupportedAssetsProvider>
								<SupportedWalletProvider>
									<BlockchainProvider>
										<Wallet />
										<Box
											onClick={() => router.push("/")}
											sx={{ cursor: "pointer" }}
										>
											<img
												src="/cennznet-header.png"
												alt="CENNZnet header"
												style={{
													width: isBrowser || isTablet ? "90px" : "45px",
													position: "absolute",
													top: "5%",
													left: "6%",
												}}
											/>
										</Box>
										<Switch setLocation={setLocation} />
										<Component {...pageProps} />
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
