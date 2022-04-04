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
} from "@/types";
import { useCENNZApi } from "@/providers/CENNZApiProvider";

interface StakeContextType {
	stakingAsset: CENNZAsset;
	spendingAsset: CENNZAsset;

	stakeAction: StakeAction;
	setStakeAction: Dispatch<SetStateAction<StakeAction>>;

	electionInfo: ElectionInfo;

	tableView: OverviewTable;
	setTableView: Dispatch<SetStateAction<OverviewTable>>;
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

	useEffect(() => {
		if (!api) return;

		const fetchElectionInfo = async () => {
			const [elected, waiting] = await Promise.all([
				api.derive.stakingCennznet.electedInfo,
				api.derive.stakingCennznet.waitingInfo,
			]);

			setElectionInfo({ elected: await elected(), waiting: await waiting() });
		};

		void fetchElectionInfo();
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
