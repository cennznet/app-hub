import {
	BridgeChain,
	BridgedEthereumToken,
	EthereumToken,
	IntrinsicElements,
} from "@/types";
import { css } from "@emotion/react";
import { useCallback, useMemo, VFC } from "react";
import TokenInput from "@/components/shared/TokenInput";
import { Theme } from "@mui/material";
import { useBridge } from "@/providers/BridgeProvider";
import { useBalanceValidation, useCENNZBalances } from "@/hooks";
import useMetaMaskBalances from "@/hooks/useMetaMaskBalances";
import { Balance } from "@/utils";
import AddressInput from "@/components/shared/AddressInput";
import useAddressValidation from "@/hooks/useAddressValidation";

interface BridgeTokenDestinationProps {}

const BridgeTokenDestination: VFC<
	IntrinsicElements["div"] & BridgeTokenDestinationProps
> = (props) => {
	const {
		erc20Token,
		erc20Value,
		erc20Tokens,
		transferToken,
		bridgeAction,
		transferAddress,
		setTransferAddress,
	} = useBridge();

	const [cennzBalance] = useCENNZBalances(
		transferToken as BridgedEthereumToken
	);

	const [metaMaskBalance] = useMetaMaskBalances(transferToken as EthereumToken);

	const transferBalance =
		bridgeAction === "Withdraw" ? cennzBalance : metaMaskBalance;

	const onTransferMaxRequest = useMemo(() => {
		const setErc20Value = erc20Value.setValue;
		return () => setErc20Value(transferBalance.toInput());
	}, [transferBalance, erc20Value.setValue]);

	const onTransferAddressChange = useCallback(
		(event) => {
			setTransferAddress(event.target.value);
		},
		[setTransferAddress]
	);

	const { inputRef: transferInputRef } = useBalanceValidation(
		Balance.fromInput(erc20Value.value, transferToken),
		transferBalance
	);

	const addressType: BridgeChain =
		bridgeAction === "Withdraw" ? "Ethereum" : "CENNZnet";

	const { inputRef: addressInputRef } = useAddressValidation(
		transferAddress,
		addressType
	);

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				<label htmlFor="transferInput">TRANSFER TOKEN</label>
				<TokenInput
					onMaxValueRequest={onTransferMaxRequest}
					selectedTokenId={erc20Token.tokenId}
					onTokenChange={erc20Token.onTokenChange}
					value={erc20Value.value}
					onValueChange={erc20Value.onValueChange}
					tokens={erc20Tokens}
					id="transferInput"
					ref={transferInputRef}
					required
					scale={4}
					min={0.0001}
				/>
				<div css={styles.tokenBalance}>
					Balance: <span>{transferBalance?.toBalance() ?? "0.0000"}</span>
				</div>
			</div>
			<div css={styles.formField}>
				<label htmlFor="transferInput">
					{bridgeAction === "Withdraw"
						? "ETHEREUM ADDRESS"
						: "CENNZnet ADDRESS"}
				</label>
				<AddressInput
					value={transferAddress}
					onChange={onTransferAddressChange}
					addressType={addressType}
					ref={addressInputRef}
				/>
			</div>
		</div>
	);
};

export default BridgeTokenDestination;

const styles = {
	root: css``,

	formField: ({ palette }: Theme) => css`
		margin-bottom: 1.5em;

		&:last-child {
			margin-bottom: 0;
		}

		label {
			font-weight: bold;
			font-size: 14px;
			margin-bottom: 0.5em;
			display: block;
			color: ${palette.primary.main};
		}
	`,

	tokenBalance: ({ palette }: Theme) => css`
		margin-top: 0.25em;
		font-weight: 500;
		color: ${palette.grey["700"]};
		font-size: 14px;

		span {
			font-family: "Roboto Mono", monospace;
			font-weight: bold;
		}
	`,
};
