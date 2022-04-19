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

interface StakeContextType {
	stakingAsset: CENNZAsset;
	spendingAsset: CENNZAsset;

	stakeAction: StakeAction;
	setStakeAction: Dispatch<SetStateAction<StakeAction>>;

	electionInfo: {
		elected: ElectedCandidate[];
		waiting: ElectedCandidate[];
	};

	tableView: OverviewTable;
	setTableView: Dispatch<SetStateAction<OverviewTable>>;

	extrinsic: SubmittableExtrinsic<"promise", any>;
	setExtrinsic: Dispatch<SetStateAction<SubmittableExtrinsic<"promise", any>>>;

	stashAddress: string;
	setStashAddress: Dispatch<SetStateAction<string>>;
}

const StakeContext = createContext<StakeContextType>({} as StakeContextType);

interface StakeProviderProps {
	stakeAssets: StakeAssets;
}

const StakeProvider: FC<StakeProviderProps> = ({ children, stakeAssets }) => {
	const { api } = useCENNZApi();
	const { stakingAsset, spendingAsset } = stakeAssets;
	const [stakeAction, setStakeAction] = useState<StakeAction>();
	const [electionInfo, setElectionInfo] = useState<ElectionInfo>();
	const [tableView, setTableView] = useState<OverviewTable>("elected");
	const [extrinsic, setExtrinsic] =
		useState<SubmittableExtrinsic<"promise", any>>();
	const [stashAddress, setStashAddress] = useState<string>();

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

				electionInfo,

				tableView,
				setTableView,

				extrinsic,
				setExtrinsic,

				stashAddress,
				setStashAddress,
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
