import type { AppProps } from "next/app";
import { isBrowser, isTablet } from "react-device-detect";
import "../theme/styles.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
      </ThemeProvider>
    </>
  );
}

export default MyApp;
