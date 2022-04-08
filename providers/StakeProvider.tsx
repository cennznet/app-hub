import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useEffect,
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
} from "@/types";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import {
	TokenInputHook,
	TxStatusHook,
	useTokenInput,
	useTxStatus,
} from "@/hooks";

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
}

const StakeContext = createContext<StakeContextType>({} as StakeContextType);

interface StakeProviderProps {
	stakeAssets: StakeAssets;
}

const StakeProvider: FC<StakeProviderProps> = ({ children, stakeAssets }) => {
	const { api } = useCENNZApi();
	const { stakingAsset, spendingAsset } = stakeAssets;
	const [stakeAction, setStakeAction] = useState<StakeAction>("newStake");
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
