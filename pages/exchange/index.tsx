import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import TokenPicker from "../../components/bridge/TokenPicker";
import {useCENNZApi} from "../../providers/CENNZApiProvider";
import SupportedAssetsProvider, {useAssets} from "../../providers/SupportedAssetsProvider";


const Exchange: React.FC<{}> = () => {
    const [token, setToken] = useState("");
    const [receivedTokenValue, setReceivedTokenValue] = React.useState<string>("0");
    const [exchangeTokenValue, setExchangeTokenValue] = React.useState<string>("0");
    const { api, apiRx, updateApi }: any = useCENNZApi();
    const assets = useAssets();

    useEffect( () => {
        updateApi("wss://cennznet.unfrastructure.io/public/ws");
    },[])

    useEffect( () => {
        const CENNZ = '1';
        const CENTRAPAY = '2';
        const setReceivedTokenAmount = async () => {
            if(parseInt(exchangeTokenValue) > 0 && api){
                const sellPrice = await(api.rpc as any).cennzx.sellPrice(CENNZ, exchangeTokenValue, CENTRAPAY);
                setReceivedTokenValue(sellPrice.price.toString())
            }
        };
        setReceivedTokenAmount();
    },[exchangeTokenValue, assets]);

    return (
        <SupportedAssetsProvider>
            <Box
                sx={{
                    position: "absolute",
                    top: "30%",
                    left: "30%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Button
                    style={{
                        position: "absolute",
                        top: "-5%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#FFFFFF",
                        border: "4px solid #1130FF",
                        flex: "none",
                        order: 0,
                        alignSelf: "stretch",
                        flexGrow: 1,
                        margin: "0px 0px",
                        borderBottom: "none",
                        fontFamily: "Teko",
                        fontWeight: "bold",
                        fontSize: "24px",
                        lineHeight: "124%",
                        color: "#1130FF",
                    }}
                >
                    Swap Tokens
                </Button>
                <Box
                    component="form"
                    sx={{
                        width: "552px",
                        height: "auto",
                        margin: "0 auto",
                        background: "#FFFFFF",
                        border: "4px solid #1130FF",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "0px",
                    }}
                >
                    <TokenPicker setToken={setToken} />
                    <TextField
                        label="Amount"
                        variant="outlined"
                        required
                        sx={{
                            width: "80%",
                            m: "30px 0 30px",
                        }}
                        value={exchangeTokenValue}
                        onChange={(event) => setExchangeTokenValue(event.target.value)}
                    />
                    <TokenPicker setToken={setToken} />
                    <TextField
                        label="Amount"
                        variant="outlined"
                        required
                        sx={{
                            width: "80%",
                            m: "30px 0 30px",
                        }}
                        value={receivedTokenValue}
                        onChange={(event) => setReceivedTokenValue(event.target.value)}
                    />
                    <Button
                        sx={{
                            fontFamily: "Teko",
                            fontWeight: "bold",
                            fontSize: "21px",
                            lineHeight: "124%",
                            color: "#1130FF",
                            mt: "30px",
                            mb: "50px",
                        }}
                        size="large"
                        variant="outlined"
                    >
                        Exchange
                    </Button>
                </Box>
            </Box>
        </SupportedAssetsProvider>
    );
};

export default Exchange;
