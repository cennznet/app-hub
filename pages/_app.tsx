import type { AppProps } from "next/app";
import { isBrowser, isTablet } from "react-device-detect";
import "../theme/styles.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme/theme";
import CssBaseline from "@mui/material/CssBaseline";
import BlockchainProvider from "../context/bridge/BlockchainContext";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { useRouter } from "next/router";

const Web3 = dynamic(() => import("../components/bridge/Web3"), { ssr: false });

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Web3>
          <BlockchainProvider>
            <Box onClick={() => router.push("/")} sx={{ cursor: "pointer" }}>
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
            <Component {...pageProps} />
          </BlockchainProvider>
        </Web3>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
