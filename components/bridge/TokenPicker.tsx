import React, { useState, useEffect } from "react";
import store from "store";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import ERC20Tokens from "../../artifacts/erc20tokens.json";
import { ETH, ETH_LOGO } from "../../utils/helpers";
import { useAssets } from "../../providers/SupportedAssetsProvider";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const TokenPicker: React.FC<{ setToken: Function; cennznet?: boolean }> = ({
  setToken,
  cennznet = true,
}) => {
  const [tokens, setTokens] = useState<Object[]>([{}]);
  const [selectedToken, setSelectedToken] = useState("");
  const assets = useAssets();

  useEffect(() => {
    if (cennznet && assets) {
      let tokes: Object[] = [];

      assets.map((asset) => {
        asset.symbol === "ETH"
          ? tokes.push({
              symbol: asset.symbol,
              logo: ETH_LOGO,
            })
          : tokes.push({
              symbol: asset.symbol,
              logo: `/images/${asset.symbol.toLowerCase()}.svg`,
            });
      });

      setTokens(tokes);
    } else {
      let tokes: Object[] = [
        {
          symbol: "ETH",
          logo: ETH_LOGO,
        },
      ];
      const chainId = store.get("token-chain-id");

      ERC20Tokens.tokens.map((token) => {
        if (token.chainId === chainId) {
          tokes.push({ symbol: token.symbol, logo: token.logoURI });
        }
      });
      setTokens(tokes);
    }
  }, [cennznet, assets]);

  useEffect(() => {
    if (cennznet && assets) {
      assets.map(
        (asset) => selectedToken === asset.symbol && setToken(String(asset.id))
      );
    } else {
      const chainId = store.get("token-chain-id");

      ERC20Tokens.tokens.map((token) => {
        if (
          (token.symbol === selectedToken && token.chainId === chainId) ||
          selectedToken === "ETH"
        ) {
          selectedToken === "ETH" ? setToken(ETH) : setToken(token.address);
        }
      });
    }
  }, [cennznet, assets, selectedToken, setToken]);

  return (
    <FormControl sx={{ width: "80%", mt: "50px" }} required>
      <InputLabel>Token</InputLabel>
      <Select
        required
        value={selectedToken}
        onChange={(e) => setSelectedToken(e.target.value)}
        input={<OutlinedInput label="Token" />}
        MenuProps={MenuProps}
        sx={{ fontSize: "18px" }}
      >
        {tokens.map((token: any, i) => (
          <MenuItem
            key={i}
            value={token.symbol}
            sx={{
              fontSize: "18px",
            }}
          >
            <img
              key={`img ${token.logo}`}
              alt="token logo"
              src={token.logo}
              style={{ marginRight: "12px", width: "20px" }}
            />
            {token.symbol}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TokenPicker;
