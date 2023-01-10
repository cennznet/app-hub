import { useCallback } from "react";
import { Balance, CENNZTransaction, signAndSendTx } from "@/libs/utils";
import { useStake } from "@/libs/providers/StakeProvider";
import { useCENNZWallet } from "@/libs/providers/CENNZWalletProvider";
import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import { SubmittableExtrinsic } from "@cennznet/api/types";

const amountCalls = {
	addStake: "bondExtra",
	cancelWithdrawal: "rebond",
	unstake: "unbond",
};

const noParamCalls = {
	chill: "chill",
	withdraw: "withdrawUnbonded",
};

export default function useStakeActionRequest(): () => Promise<void> {
	const { api } = useCENNZApi();
	const { selectedAccount, wallet } = useCENNZWallet();
	const {
		stakeAction,
		stakeAmountInput,
		stakingAsset,
		stakeRewardDestination,
		setTxSuccess,
		setTxFailure,
		setTxPending,
		setTxIdle,
		nominateExtrinsic,
		stakeControllerAccount,
	} = useStake();

	return useCallback(async () => {
		const stakeAmount = Balance.fromInput(stakeAmountInput.value, stakingAsset);

		let stakeTx: SubmittableExtrinsic<"promise">;

		if (stakeAction === "newStake")
			stakeTx = api.tx.staking.bond(
				stakeControllerAccount,
				stakeAmount as any,
				{
					Account: stakeRewardDestination,
				}
			);
		if (Object.keys(amountCalls).includes(stakeAction))
			stakeTx = api.tx.staking[amountCalls[stakeAction]](stakeAmount);
		if (Object.keys(noParamCalls).includes(stakeAction))
			stakeTx = api.tx.staking[noParamCalls[stakeAction]]();
		if (stakeAction === "changeNominations") stakeTx = nominateExtrinsic;
		if (stakeAction === "changeRewardDestination")
			stakeTx = api.tx.staking.setPayee({ Account: stakeRewardDestination });
		if (stakeAction === "changeController")
			stakeTx = api.tx.staking.setController(stakeControllerAccount);

		try {
			setTxPending();

			let tx: CENNZTransaction;

			if (stakeAction === "newStake")
				tx = await signAndSendTx(
					api.tx.utility.batch([stakeTx, nominateExtrinsic]),
					selectedAccount.address,
					wallet.signer
				);
			else
				tx = await signAndSendTx(
					stakeTx,
					selectedAccount.address,
					wallet.signer
				);

			tx.on("txCancelled", () => setTxIdle());

			tx.on("txHashed", () => {
				setTxPending({
					txHashLink: tx.getHashLink(),
				});
			});

			tx.on("txFailed", (result) =>
				setTxFailure({
					errorCode: tx.decodeError(result),
					txHashLink: tx.getHashLink(),
				})
			);

			tx.on("txSucceeded", () => {
				const displayAmount =
					stakeAction === "addStake" ||
					stakeAction === "newStake" ||
					stakeAction === "unstake";

				setTxSuccess({
					stakeValue: displayAmount ? stakeAmount : null,
					txHashLink: tx.getHashLink(),
				});
			});
		} catch (error) {
			console.info(error);
			return setTxFailure({ errorCode: error?.code as string });
		}
	}, [
		api,
		selectedAccount,
		stakeAction,
		wallet,
		stakingAsset,
		nominateExtrinsic,
		stakeRewardDestination,
		stakeAmountInput,
		stakeControllerAccount,
		setTxPending,
		setTxIdle,
		setTxFailure,
		setTxSuccess,
	]);
}
