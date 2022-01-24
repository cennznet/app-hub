import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Button, TextField } from "@mui/material";
import TokenPicker from "../../components/bridge/TokenPicker";

const Exchange: React.FC<{}> = () => {
    const [token, setToken] = useState("");

    return (
        <Box
            sx={{
                position: "absolute",
                top: "30%",
                // width: "20%",
                left: "30%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
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
    );
};

export default Exchange;
