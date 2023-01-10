import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	CENNZAsset,
	StakeAction,
	StakeAssets,
	ElectionInfo,
	OverviewTable,
	DeriveStakingQuery,
	ElectedCandidate,
	PropsWithChildren,
	AccountLedger,
} from "@/libs/types";
import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import {
	TxStatusHook,
	TokenInputHook,
	useTokenInput,
	useTxStatus,
} from "@/libs/hooks";
import { Balance } from "@/libs/utils";
import { useCENNZWallet } from "@/libs/providers/CENNZWalletProvider";

import { IOption } from "@cennznet/types";

interface StakeContextType extends TxStatusHook {
	stakingAsset: CENNZAsset;
	spendingAsset: CENNZAsset;

	stakeAction: StakeAction;
	setStakeAction: Dispatch<SetStateAction<StakeAction>>;

	stakeAmountInput: TokenInputHook<string>[1];

	electionInfo: {
		elected: ElectedCandidate[];
		waiting: ElectedCandidate[];
	};

	tableView: OverviewTable;
	setTableView: Dispatch<SetStateAction<OverviewTable>>;

	nominateExtrinsic: SubmittableExtrinsic<"promise", any>;
	setNominateExtrinsic: Dispatch<
		SetStateAction<SubmittableExtrinsic<"promise", any>>
	>;

	stakeRewardDestination: string;
	setStakeRewardDestination: Dispatch<SetStateAction<string>>;
	stakeControllerAccount: string;
	setStakeControllerAccount: Dispatch<SetStateAction<string>>;

	accountLedger: AccountLedger;
	setAccountLedger: Dispatch<SetStateAction<AccountLedger>>;
	stakedBalance: Balance;
	unbondedBalance: Balance;
}

const StakeContext = createContext<StakeContextType>({} as StakeContextType);

interface StakeProviderProps extends PropsWithChildren {
	stakeAssets: StakeAssets;
}

const StakeProvider: FC<StakeProviderProps> = ({ children, stakeAssets }) => {
	const { api } = useCENNZApi();
	const { selectedAccount } = useCENNZWallet();
	const { stakingAsset, spendingAsset } = stakeAssets;
	const [stakeAction, setStakeAction] = useState<StakeAction>("newStake");
	const [accountLedger, setAccountLedger] = useState<AccountLedger>();
	const [electionInfo, setElectionInfo] = useState<ElectionInfo>();
	const [tableView, setTableView] = useState<OverviewTable>("elected");
	const [nominateExtrinsic, setNominateExtrinsic] =
		useState<SubmittableExtrinsic<"promise", any>>();
	const [stakeRewardDestination, setStakeRewardDestination] =
		useState<string>();
	const [stakeControllerAccount, setStakeControllerAccount] =
		useState<string>();

	const [_, stakeAmountInput] = useTokenInput(stakingAsset.assetId);

	const parseElectedInfo = (electedInfo: DeriveStakingQuery[]) => {
		return electedInfo.map((info) => {
			const electedInfo = {};
			Object.keys(info).forEach((key) => {
				try {
					electedInfo[key] = info[key].toHuman();
				} catch (_) {
					electedInfo[key] = info[key];
				}
			});
			return electedInfo;
		});
	};

	useEffect(() => {
		if (!api) return;

		const fetchElectionInfo = async () => {
			const [elected, waiting] = await Promise.all([
				api.derive.stakingCennznet.electedInfo,
				api.derive.stakingCennznet.waitingInfo,
			]);

			return [await elected(), await waiting()];
		};

		fetchElectionInfo().then(([elected, waiting]) =>
			setElectionInfo({
				elected: parseElectedInfo(elected.info),
				waiting: parseElectedInfo(waiting.info),
			})
		);
	}, [api]);

	useEffect(() => {
		if (!api || !selectedAccount) return;

		const fetchAccountLedger = async () =>
			await api.query.staking.ledger(selectedAccount.address);

		fetchAccountLedger().then((ledgerOption: IOption<any>) => {
			const ledger = ledgerOption.unwrapOrDefault();
			setAccountLedger(ledger.toJSON());
		});
	}, [api, selectedAccount]);

	const stakedBalance = useMemo(
		() =>
			accountLedger?.active && new Balance(accountLedger.active, stakingAsset),
		[stakingAsset, accountLedger]
	);

	const unbondedBalance = useMemo(
		() =>
			!!accountLedger &&
			new Balance(accountLedger.total - accountLedger.active, stakingAsset),
		[stakingAsset, accountLedger]
	);

	return (
		<StakeContext.Provider
			value={{
				stakingAsset,
				spendingAsset,

				stakeAction,
				setStakeAction,

				stakeAmountInput,

				electionInfo,

				tableView,
				setTableView,

				nominateExtrinsic,
				setNominateExtrinsic,

				stakeRewardDestination,
				setStakeRewardDestination,
				stakeControllerAccount,
				setStakeControllerAccount,

				accountLedger,
				setAccountLedger,
				stakedBalance,
				unbondedBalance,

				...useTxStatus(),
			}}
		>
			{children}
		</StakeContext.Provider>
	);
};

export default StakeProvider;

export const useStake = (): StakeContextType => {
	return useContext(StakeContext);
};
