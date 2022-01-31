import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { isBrowser, isTablet } from "react-device-detect";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme/theme";
import CssBaseline from "@mui/material/CssBaseline";
import "../theme/styles.css";
import { Box } from "@mui/material";
import CENNZApiProvider from "../providers/CENNZApiProvider";
import SupportedWalletProvider from "../providers/SupportedWalletProvider";
import DappModuleProvider from "../providers/DappModuleProvider";
import Web3AccountsProvider from "../providers/Web3AccountsProvider";
import Switch from "../components/AppSwitch";
import Wallet from "../components/Wallet";
import SupportedAssetsProvider from "../providers/SupportedAssetsProvider";

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
				<CENNZApiProvider>
					<DappModuleProvider>
						<Web3AccountsProvider>
							<SupportedAssetsProvider>
								<SupportedWalletProvider>
									<Wallet />
									<Box
										onClick={() => setLocation("index")}
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
									<Switch location={location} setLocation={setLocation} />
									<Component {...pageProps} />
								</SupportedWalletProvider>
							</SupportedAssetsProvider>
						</Web3AccountsProvider>
					</DappModuleProvider>
				</CENNZApiProvider>
			</ThemeProvider>
		</>
	);
}

export default MyApp;
