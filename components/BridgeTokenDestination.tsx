import { BridgeChain, BridgedEthereumToken, IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { useCallback, useMemo, VFC } from "react";
import TokenInput from "@/components/shared/TokenInput";
import { Theme } from "@mui/material";
import { useBridge } from "@/providers/BridgeProvider";
import { useBalanceValidation, useCENNZBalances } from "@/hooks";
import { Balance } from "@/utils";
import AddressInput from "@/components/shared/AddressInput";
import useAddressValidation from "@/hooks/useAddressValidation";

interface BridgeTokenDestinationProps {}

const BridgeTokenDestination: VFC<
	IntrinsicElements["div"] & BridgeTokenDestinationProps
> = (props) => {
	const {
		transferToken,
		transferValue,
		ethereumTokens,
		transferAsset,
		bridgeAction,
		transferAddress,
		setTransferAddress,
		metaMaskBalance,
	} = useBridge();

	const [cennzBalance] = useCENNZBalances(
		transferAsset as BridgedEthereumToken
	);

	const transferBalance =
		bridgeAction === "Withdraw" ? cennzBalance : metaMaskBalance;

	const onTransferMaxRequest = useMemo(() => {
		const setErc20Value = transferValue.setValue;
		return () => setErc20Value(transferBalance.toInput());
	}, [transferBalance, transferValue.setValue]);

	const onTransferAddressChange = useCallback(
		(event) => {
			setTransferAddress(event.target.value);
		},
		[setTransferAddress]
	);

	const addressType: BridgeChain =
		bridgeAction === "Withdraw" ? "Ethereum" : "CENNZnet";

	const { inputRef: transferInputRef } = useBalanceValidation(
		Balance.fromInput(transferValue.value, transferAsset),
		transferBalance
	);

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
					selectedTokenId={transferToken.tokenId}
					onTokenChange={transferToken.onTokenChange}
					value={transferValue.value}
					onValueChange={transferValue.onValueChange}
					tokens={ethereumTokens}
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
