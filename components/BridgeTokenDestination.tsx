import { BridgedEthereumToken, IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { useCallback, useEffect, useMemo, VFC } from "react";
import TokenInput from "@/components/shared/TokenInput";
import { LinearProgress, Theme } from "@mui/material";
import { useBridge } from "@/providers/BridgeProvider";
import { useBalanceValidation, useCENNZBalances } from "@/hooks";
import { Balance } from "@/utils";
import AddressInput from "@/components/shared/AddressInput";
import useAddressValidation from "@/hooks/useAddressValidation";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { useWalletProvider } from "@/providers/WalletProvider";

interface BridgeTokenDestinationProps {}

const BridgeTokenDestination: VFC<
	IntrinsicElements["div"] & BridgeTokenDestinationProps
> = (props) => {
	const {
		transferSelect,
		transferInput,
		ethereumTokens,
		transferAsset,
		bridgeAction,
		transferCENNZAddress,
		setTransferCENNZAddress,
		transferMetaMaskAddress,
		setTransferMetaMaskAddress,
		ethereumBalance,
		advancedExpanded,
	} = useBridge();
	const { selectedWallet } = useWalletProvider();

	const [cennzBalance] = useCENNZBalances(
		transferAsset as BridgedEthereumToken
	);

	const transferBalance =
		bridgeAction === "Withdraw" ? cennzBalance : ethereumBalance;

	const onTransferMaxRequest = useMemo(() => {
		const setErc20Value = transferInput.setValue;
		return () => setErc20Value(transferBalance.toInput());
	}, [transferBalance, transferInput.setValue]);

	const onTransferCENNZAddressChange = useCallback(
		(event) => {
			setTransferCENNZAddress(event.target.value);
		},
		[setTransferCENNZAddress]
	);

	const onTransferMetaMaskAddressChange = useCallback(
		(event) => {
			setTransferMetaMaskAddress(event.target.value);
		},
		[setTransferMetaMaskAddress]
	);

	const { inputRef: transferInputRef } = useBalanceValidation(
		Balance.fromInput(transferInput.value, transferAsset),
		transferBalance,
		bridgeAction === "Withdraw" && advancedExpanded
	);

	const { inputRef: cennzAddressInputRef } = useAddressValidation(
		transferCENNZAddress,
		"CENNZnet"
	);

	const { inputRef: metaMaskAddressInputRef } = useAddressValidation(
		transferMetaMaskAddress,
		"Ethereum"
	);

	// Sync CENNZ selected account with `transferCENNZAddressInput`
	const { selectedAccount: cennzAccount } = useCENNZWallet();
	useEffect(() => {
		if (!cennzAccount?.address) return;
		setTransferCENNZAddress(cennzAccount.address);
	}, [cennzAccount?.address, setTransferCENNZAddress]);

	// Sync MetaMask selected account with `transferMetaMaskAddressInput`
	const { selectedAccount: metaMaskAccount } = useMetaMaskWallet();
	useEffect(() => {
		if (!metaMaskAccount?.address) return;
		setTransferMetaMaskAddress(metaMaskAccount.address);
	}, [metaMaskAccount?.address, setTransferMetaMaskAddress]);

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				<label htmlFor="transferInput">TRANSFER TOKEN</label>
				<TokenInput
					onMaxValueRequest={onTransferMaxRequest}
					selectedTokenId={transferSelect.tokenId}
					onTokenChange={transferSelect.onTokenChange}
					value={transferInput.value}
					onValueChange={transferInput.onValueChange}
					tokens={ethereumTokens}
					id="transferInput"
					ref={transferInputRef}
					required
					scale={transferAsset.decimals}
					min={Balance.fromString("1", transferAsset).toInput()}
				/>
				{transferBalance !== null && (
					<div css={styles.tokenBalance}>
						Balance: <span>{transferBalance?.toBalance() ?? "0.0"}</span>
					</div>
				)}
				{transferBalance === null && !!metaMaskAccount && !!cennzAccount && (
					<div css={styles.tokenBalance}>
						Balance: <LinearProgress css={[styles.formInfoProgress]} />
					</div>
				)}
			</div>
			{bridgeAction === "Deposit" && (
				<div css={styles.formField}>
					{selectedWallet === "CENNZnet" && (
						<>
							<label htmlFor="transferCENNZAddressInput">
								CENNZnet ADDRESS
							</label>
							<AddressInput
								id="transferCENNZAddressInput"
								value={transferCENNZAddress}
								onChange={onTransferCENNZAddressChange}
								addressType="CENNZnet"
								ref={cennzAddressInputRef}
							/>
						</>
					)}
					{selectedWallet === "MetaMask" && (
						<>
							<label htmlFor="transferMetaMaskAddressInput">
								ETHEREUM ADDRESS
							</label>
							<AddressInput
								id="transferMetaMaskAddressInput"
								value={transferMetaMaskAddress}
								onChange={onTransferMetaMaskAddressChange}
								addressType="Ethereum"
								ref={metaMaskAddressInputRef}
							/>
						</>
					)}
				</div>
			)}

			{bridgeAction === "Withdraw" && (
				<div css={styles.formField}>
					<label htmlFor="transferMetaMaskAddressInput">ETHEREUM ADDRESS</label>
					<AddressInput
						id="transferMetaMaskAddressInput"
						value={transferMetaMaskAddress}
						onChange={onTransferMetaMaskAddressChange}
						addressType="Ethereum"
						ref={metaMaskAddressInputRef}
					/>
				</div>
			)}
		</div>
	);
};

export default BridgeTokenDestination;

const styles = {
	root: css``,

	formField: ({ palette }: Theme) =>
		css`
			display: block;
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
		display: flex;
		align-items: center;

		span {
			font-family: "Roboto Mono", monospace;
			font-weight: bold;
			margin-left: 0.25em;
			letter-spacing: -0.025em;
		}
	`,
	formInfoProgress: css`
		display: inline-block;
		width: 25px;
		border-radius: 10px;
		opacity: 0.5;
	`,
};
